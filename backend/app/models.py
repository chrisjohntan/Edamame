from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column 
from sqlalchemy import String, Integer, Text


db = SQLAlchemy()

class User(db.Modedl) :
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

