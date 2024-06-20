from sqlalchemy.orm import Mapped, mapped_column , relationship
from sqlalchemy import String, Integer, Text, ForeignKey, DateTime, Interval
from .extensions import db
from typing import List

class User(db.Model) :
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    # TODO: in legacy, try to change later
    # user_cards: Mapped[List["Card"]] = relationship('Card', backref="users")
    # user_decks: Mapped[List["Deck"]] = relationship('Deck', backref="users")
    user_cards: Mapped[List["Card"]] = relationship('Card', back_populates="user")
    user_decks: Mapped[List["Deck"]] = relationship('Deck', back_populates="user", cascade="all, delete")
    # user_cards: Mapped[List["Card"]] = relationship(back_populates="users")

    def __repr__(self) -> str:
        return "User: {self.username}"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
    
class Card(db.Model):
    __tablename__ = "cards"
    id: Mapped[int] = mapped_column(primary_key=True)
    header: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=True)
    header_flipped: Mapped[str] = mapped_column(Text, nullable=False)
    body_flipped: Mapped[str] = mapped_column(Text, nullable=True)
    time_created: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    time_for_review: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    time_interval: Mapped[Interval] = mapped_column(Interval, nullable=False)
    last_reviewed: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    last_modified: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    reviews_done: Mapped[Integer] = mapped_column(Integer, nullable=False)

    # TODO: in legacy, try to change later
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("decks.id"), nullable=False)
    # user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    # users: Mapped[List["User"]] = relationship(back_populates="cards")
    user: Mapped["User"] = relationship("User", back_populates="user_cards")
    deck: Mapped["Deck"] = relationship("Deck", back_populates="cards")
    
    def __repr__(self) -> str:
        return "Card: {self.header}"

class Deck(db.Model):
    __tablename__ = "decks"
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    time_created: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    last_reviewed: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    last_modified: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    reviews_done: Mapped[Integer] = mapped_column(Integer, nullable=False)

    # TODO: in legacy, try to change later
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    # card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    user: Mapped["User"] = relationship("User", back_populates="user_decks")
    cards: Mapped[List["Card"]] = relationship("Card", back_populates="deck", cascade="all, delete")
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "deck_name": self.deck_name,
            "user_id": self.user_id
        }
    