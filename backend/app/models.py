from sqlalchemy.orm import Mapped, mapped_column , relationship
from sqlalchemy import String, Integer, Text, ForeignKey
from .extensions import db
from typing import List

class User(db.Model) :
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    # TODO: in legacy, try to change later
    user_cards: Mapped[List["Card"]] = relationship('Card', backref="users")
    user_decks: Mapped[List["Deck"]] = relationship('Deck', backref="users")
    # user_cards: Mapped[List["Card"]] = relationship(back_populates="users")

    def __repr__(self) -> str:
        return "User: {self.username}"
    
class Card(db.Model):
    __tablename__ = "cards"
    id: Mapped[int] = mapped_column(primary_key=True)
    header: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=True)
    header_flipped: Mapped[str] = mapped_column(Text, nullable=False)
    body_flipped: Mapped[str] = mapped_column(Text, nullable=True)

    # TODO: in legacy, try to change later
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("decks.id"))
    # user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    # users: Mapped[List["User"]] = relationship(back_populates="cards")
    
    def __repr__(self) -> str:
        return "Card: {self.header}"

class Deck(db.Model):
    __tablename__ = "decks"
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    # TODO: in legacy, try to change later
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    # card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))