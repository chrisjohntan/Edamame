# move all extension objects here
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate()
jwt_manager = JWTManager()


