from ..extensions import bcrypt, db

from flask import Blueprint, request, jsonify, abort
from flask_bcrypt import generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token,\
    jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies, get_current_user
from ..models import User
import validators
from http import HTTPStatus
from sqlalchemy import or_
from .mail import send_email, encode_token, decode_token

auth = Blueprint("auth", __name__)

@auth.route("/test", methods=["GET"])
def test():
    print("call")
    return jsonify({"msg": "Testing"})

# create new user
@auth.route('/register', methods=["POST"])
def create_new_user():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    print(username,email,password)
    
    # TODO: Validate user input (username, password, email)
    # TODO: Replace all abort() with json
    
    
    # Check if username or email already exists
    username_exists = db.session.execute(db.select(User).where(User.username==username)).first()
    print(username_exists)
    if (username_exists):
        print("username already exist")
        return jsonify({
            "error": "Username already exists",
        }), HTTPStatus.CONFLICT
        
    email_exists = db.session.execute(db.select(User).where(User.email==email)).first()
    print(email_exists)
    if (email_exists):
        print("email already exist")
        return jsonify({
            "error": "Email already exists",
        }), HTTPStatus.CONFLICT
    
    user = User(
        username=username, 
        password=bcrypt.generate_password_hash(password).decode("utf-8"),
        email=email
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        "message": "User created",
        "user": {
            "username": username, "email": email
        }
    }), HTTPStatus.CREATED

# log in user
@auth.route("/login", methods=["POST"])
def login():
    print(request)
    username = request.json["username"]
    password = request.json["password"]

    # TODO: Something wrong with this
    user = db.session.execute(
        db.select(User).filter_by(username=username)
        ).scalar()
    
    if user == None or not bcrypt.check_password_hash(user.password, password) :
        return jsonify({
            "error": "Username or password incorrect"
            }), HTTPStatus.BAD_REQUEST
        
    response = jsonify({"msg": "login successful"})
    access_token = create_access_token(identity=user.username)
    set_access_cookies(response, access_token)
    
    return response

# log out user
@auth.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# check if token is valid, return user details
@auth.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user: User = get_current_user()
    if current_user == None:
        return jsonify({"error": "Unable to retrieve user"}), HTTPStatus.UNAUTHORIZED
    return jsonify(logged_in_as={"username": current_user.username}), HTTPStatus.OK

@auth.route("/send_forgot_password_email/<str:user_email>", methods=["GET"])
@jwt_required()
def send_forgot_password_email(user_email):
    user: User = User.query.filter_by(email=user_email).first()
    token = encode_token(user.password[7:14], {"id": user.id})
    link = f"www.edamame.com/reset/{token}"

    msg = f"""\
    Subject: Reset Password\nReset your password by clicking this link here {link}"""

    send_email(user_email, msg)

@auth.route("/auth_forgot_password_link/<str:user_email>/<str:token>", methods=["GET"])
@jwt_required()
def auth_forgot_password_link(user_email, token):
    user: User = User.query.filter_by(email=user_email).first()

    payload = decode_token(user.password[7:14], token)
    if payload["id"] == user.id:
        return jsonify({
            "message": "Authenticated",
            }), HTTPStatus.OK
    return jsonify({"error": "error"}), HTTPStatus.UNAUTHORIZED

@auth.route("/reset_password/<int:id>/<str:new_password>", methods=["GET"])
@jwt_required()
def reset_password(id, new_password):
    user: User = User.query.filter_by(id=id).first()
    
    # placeholder
    user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()

    return jsonify({
        "message": "Password Reset",
        }), HTTPStatus.OK