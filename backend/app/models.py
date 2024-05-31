from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column , relationship
from sqlalchemy import String, Integer, Text, ForeignKey
from .extensions import db
from typing import List

class User(db.Model) :
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    cards: Mapped[List["Card"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return "User: {self.username}"
    
class Card(db.Model):
    __tablename__ = "cards"
    id: Mapped[int] = mapped_column(primary_key=True)
    header: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=True)
    header_flipped: Mapped[str] = mapped_column(Text, nullable=False)
    body_flipped: Mapped[str] = mapped_column(Text, nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped[List["User"]] = relationship(back_populates="cards")
    
    def __repr__(self) -> str:
        return "Card: {self.header}"

class Deck(db.Model):
    __tablename__ = "decks"
    id: Mapped[int] = mapped_column(primary_key=True)