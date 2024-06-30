from sqlalchemy.orm import Mapped, mapped_column , relationship
from sqlalchemy import String, Integer, Float, Text, ForeignKey, DateTime, Interval, Date
from .extensions import db, Base
from typing import List
from datetime import datetime, timedelta

class User(db.Model, Base) :
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
    
class Card(db.Model, Base):
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

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("decks.id"), nullable=False)
    # user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    # users: Mapped[List["User"]] = relationship(back_populates="cards")
    user: Mapped["User"] = relationship("User", back_populates="user_cards")
    deck: Mapped["Deck"] = relationship("Deck", back_populates="cards")
    
    def __repr__(self) -> str:
        return "Card: {self.header}"
        
    def to_dict(self) -> dict:
        exclude = {"user", "deck", "__tablename__"}
        card = {}
        for col in self.__table__.columns:
            if col.name in exclude:
                continue
            val = getattr(self, col.name)
            if isinstance(val, datetime):
                card[col.name] = val.isoformat()
            elif isinstance(val, timedelta):
                card[col.name] = val.seconds
            else:
                card[col.name] = val
        # return {
        #     col.name: getattr(self, col.name) for col in self.__table__.columns\
        #         if col.name not in exclude
        # }
        return card

    def calculate_time_interval(self):
        def ceildiv(a, b):
            return -(a // -b)
        # placeholder
        if self.time_interval == timedelta(seconds=0):
            self.time_interval = timedelta(seconds=60)

        deck: Deck = Deck.query.filter_by(id=self.deck_id).first()

        intervals_list = [self.time_interval * deck.forgot_multiplier, 
                self.time_interval * deck.hard_multiplier, 
                self.time_interval * deck.okay_multiplier, 
                self.time_interval * deck.easy_multiplier]
        
        for i in range(len(intervals_list)):
            interval = intervals_list[i]
            if interval > timedelta(days=1):
                # round up to nearest day
                day = ceildiv(interval.days*86400 + interval.seconds, 86400)
                interval = timedelta(days=day)
            elif interval > timedelta(hours=1):
                # round up to nearest hour
                hour = ceildiv(interval.days*86400 + interval.seconds, 3600)
                interval = timedelta(hours=hour)
            else:
                # round up to nearest min
                minute = ceildiv(interval.seconds, 60)
                interval = timedelta(minutes=minute)
            intervals_list[i] = interval
        # print(intervals_list)
        return intervals_list

    def update_time_interval(self, response: int):
        time_interval = self.calculate_time_interval()[response]
        if time_interval == timedelta(seconds=0):
            time_interval = timedelta(seconds=60)

        self.time_interval = time_interval


class Deck(db.Model, Base):
    __tablename__ = "decks"
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    time_created: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    last_reviewed: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    last_modified: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    reviews_done: Mapped[Integer] = mapped_column(Integer, nullable=False)
    forgot_multiplier: Mapped[Float] = mapped_column(Float, nullable=False)
    hard_multiplier: Mapped[Float] = mapped_column(Float, nullable=False)
    okay_multiplier: Mapped[Float] = mapped_column(Float, nullable=False)
    easy_multiplier: Mapped[Float] = mapped_column(Float, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    # card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    user: Mapped["User"] = relationship("User", back_populates="user_decks")
    cards: Mapped[List["Card"]] = relationship("Card", back_populates="deck", cascade="all, delete")

    
    def to_dict(self) -> dict:
        exclude = {"user", "cards", "__tablename__"}
        d = {}
        for col in self.__table__.columns:
            if col.name in exclude:
                continue
            val = getattr(self, col.name)
            if isinstance(val, datetime):
                d[col.name] = val.isoformat()
            elif isinstance(val, timedelta):
                d[col.name] = val.seconds
            else:
                d[col.name] = val
        d["size"] = len(self.cards)
        return d
    
class ReviewCount(db.Model, Base):
    __tablename__ = "review_count"
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    def to_dict(self):
        return {
            "date": self.date.isoformat(),
            "review_count": self.review_count,
            "user_id": self.user_id
        }