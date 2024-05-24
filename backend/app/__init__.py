from flask import Flask # quart maybe?
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager





# export
bcrypt = Bcrypt()


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db" # change to postgresql
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    if test_config == None:
        # config from default .env and .flaskenv files
        app.config.from_prefixed_env()
    app.config.from_object(test_config)
    
    from app.models import db
    db.init_app(app)
    db.create_all()
    migrate = Migrate(app, db)
    
    JWTManager(app)
    
    bcrypt.init_app(app)
    
    # import blueprints here
    from auth.routes import auth
    app.register_blueprint(auth)
    
    return app

