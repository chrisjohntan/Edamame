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
import datetime as dt
from jwt import ExpiredSignatureError

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
    message = {}
    error = False
    username_exists = db.session.execute(db.select(User).where(User.username==username)).first()
    print(username_exists)
    if (username_exists):
        print("username already exist")
        # return jsonify({
        #     "message": "Username already exists",
        # }), HTTPStatus.CONFLICT
        message["username"] = "Username already exists"
        error = True
    email_exists = db.session.execute(db.select(User).where(User.email==email)).first()
    print(email_exists)
    if (email_exists):
        print("email already exist")
        message["email"] = "Email already exists"
        error = True
        
        # return jsonify({
        #     "message": "Email already exists",
        # }), HTTPStatus.CONFLICT
    if error:
        return jsonify({
            "message": message,
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
        "user": user.to_dict()
    }), HTTPStatus.CREATED

# log in user
@auth.route("/login", methods=["POST"])
def login():
    print(request)
    username = request.json["username"]
    password = request.json["password"]

    # TODO: Something wrong with this
    user: User | None = db.session.execute(
        db.select(User).filter_by(username=username)
        ).scalar()
    
    if user == None:
        return jsonify({
            "message": "Username does not exist"
            }), HTTPStatus.BAD_REQUEST
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({
            "message": "Incorrect password"
            }), HTTPStatus.BAD_REQUEST
        
    response = jsonify({
        "message": "login successful",
        "user": user.to_dict()
    })
    access_token = create_access_token(identity=user.username)
    set_access_cookies(response, access_token)
    
    return response, HTTPStatus.OK

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
    return jsonify({
        "user": current_user.to_dict()
    }), HTTPStatus.OK

@auth.route("/send_forgot_password_email/<string:user_email>", methods=["GET"])
def send_forgot_password_email(user_email: str):
    user: User = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "Unable to retrieve user, there is no such email"}), HTTPStatus.UNAUTHORIZED
    payload = {
        "id": user.id,
        "exp": dt.datetime.now(tz=dt.timezone.utc) + dt.timedelta(minutes=20)
    }
    token = encode_token(key=user.password[7:14], payload=payload)
    link = f"www.edamame.com/reset/{user_email}/{token}"

    msg = f"""\
    Subject: Reset Password\nReset your password by clicking this link here {link}"""

    send_email(user_email, msg)
    
    return jsonify({
        "message": "Email sent successfully."
    })

@auth.route("/verify_reset_token/<string:user_email>/<string:token>", methods=["GET"])
def verify_reset_token(user_email, token):
    user: User | None = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "Unable to retrieve user, there is no such email"}), HTTPStatus.UNAUTHORIZED

    try:
        payload = decode_token(user.password[7:14], token)
    except ExpiredSignatureError:
        return jsonify({
            "error": "Token has expired"
        }), HTTPStatus.UNAUTHORIZED
    
    if payload["id"] == user.id:
        return jsonify({
            "message": "Authenticated",
            }), HTTPStatus.OK
    
    return jsonify({"error": "Token is invalid"}), HTTPStatus.UNAUTHORIZED

@auth.route("/reset_password/<string:user_email>/<string:token>", methods=["POST"])
def reset_password(user_email, token):
    user: User = User.query.filter_by(email=user_email).first()
    new_password = request.json["password"]

    user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()

    return jsonify({
        "message": "Password Reset",
        }), HTTPStatus.OK

@auth.route('/change_user_username', methods=["PUT", "PATCH"])
@jwt_required()
def change_user_username():
    user: User = get_current_user()
    new_username = request.json["username"]

    # Check if username already exists
    username_exists = db.session.execute(db.select(User).where(User.username==new_username)).first()
    print(username_exists)
    if (username_exists):
        return jsonify({
            "error": "Unable to change username, that username is already in use",
        }), HTTPStatus.CONFLICT
        
    user.username = new_username
    db.session.commit()
    
    return jsonify({
        "message": f"Username changed to {new_username}"
    }), HTTPStatus.OK

@auth.route('/change_user_email', methods=["PUT", "PATCH"])
@jwt_required()
def change_user_email(id):
    user: User = get_current_user()
    new_email = request.json["email"]

    # Check if email already exists
    email_exists = db.session.execute(db.select(User).where(User.email==new_email)).first()
    if (email_exists):
        print("email already exist")
        return jsonify({
            "error": "Unable to change email, that email is already in use",
        }), HTTPStatus.CONFLICT
    
    user.email = new_email
    db.session.commit()
    
    return jsonify({
        "message": f"Email changed to {new_email}"
    }), HTTPStatus.OK

@auth.route('/change_user_password', methods=["PUT", "PATCH"])
@jwt_required()
def change_user_password(id):
    user: User = get_current_user()
    new_password = request.json["password"]
    hashed = bcrypt.generate_password_hash(new_password).decode("utf-8")

    # # Check if new password is same as old password (Not sure if necessary)
    # username_exists = user.password == hashed
    # if (username_exists):
    #     return jsonify({
    #         "error": "New password can't be the same as old password",
    #     }), HTTPStatus.CONFLICT
        
    user.password = hashed
    db.session.commit()
    
    return jsonify({
        "message": f"Password changed"
    }), HTTPStatus.OK

@auth.route('/change_daily_target', methods=["PUT", "PATCH"])
@jwt_required()
def change_daily_target():
    user: User = get_current_user()
    new_target = request.json["new_target"]

    # Check if daily target is integer
    if type(new_target) != int:
        return jsonify({
            "message": "Please change the value to an integer",
        }), HTTPStatus.BAD_REQUEST
        
    user.daily_target = new_target
    db.session.commit()
    
    return jsonify({
        "message": f"Daily target has been changed to {user.daily_target}"
    }), HTTPStatus.OK