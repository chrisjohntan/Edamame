from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import get_jwt, get_jwt_identity,\
    create_access_token, set_access_cookies
from sqlalchemy.exc import MultipleResultsFound
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    load_dotenv()
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": os.environ.get("CORS_ORIGIN")}})
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI") # change to postgresql
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")
    app.config["JWT_COOKIE_SECURE"] = True
    app.config["JWT_COOKIE_SAMESITE"] = "None"

    
    if test_config == None:
        # config from default .env and .flaskenv files
        app.config.from_prefixed_env()
    app.config.from_object(test_config)
    
    from .extensions import db
    from .extensions import bcrypt
    from .extensions import migrate
    from .extensions import jwt_manager
    # import all models
    from .models import User, Card, Deck, ReviewCount
    
    db.init_app(app)
    with app.app_context():
        db.create_all()
    
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt_manager.init_app(app)
    
    # import blueprints here
    from .auth.routes import auth
    from .cards.routes import cards
    from .decks.routes import decks
    app.register_blueprint(auth)
    app.register_blueprint(cards)
    app.register_blueprint(decks)
    
    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original response
            return response
    
    @jwt_manager.user_identity_loader
    def user_identity_lookup(user: User):
        return user
    
    @jwt_manager.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        # return User.query.filter_by(id=identity).one_or_none()
        try:
            return db.session.execute(db.select(User).where(User.username==identity)).scalar_one_or_none()
        except MultipleResultsFound as e:
            print("gg man database is cooked")
            raise(e)

    return app

