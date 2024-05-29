from ..extensions import bcrypt, db

from flask import Blueprint, request, jsonify, abort
from flask_bcrypt import generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token,\
    jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from ..models import User
import validators
from http import HTTPStatus
from sqlalchemy import or_

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
    user_exists = db.session.execute(db.select(User).where(or_(User.username==username, User.email==email))).first()
    print(user_exists)
    if (user_exists):
        print("alr exist")
        abort(404)
    
    user = User(
        username=username, 
        password=bcrypt.generate_password_hash(password),
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
    username = request.json["username"]
    password = request.json["password"]
    
    user: User | None = db.session.execute(
        db.select(User).filter_by(username=username)
        ).first()
    
    # User does not exist
    if user == None or not bcrypt.check_password_hash(user.password, password) :
        return jsonify({
            "error": "Username or password incorrect"
            }), HTTPStatus.BAD_REQUEST
        
    response = jsonify({"msg": "login successful"})
    access_token = create_access_token(identity=username)
    set_access_cookies(response, access_token)
    
    return response

# log out user
@auth.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

