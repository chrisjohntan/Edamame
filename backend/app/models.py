from sqlalchemy.orm import Mapped, mapped_column , relationship
from sqlalchemy import String, Integer, Float, Text, ForeignKey, DateTime, Interval, Date, Boolean
from .extensions import db, Base
from typing import List
from datetime import datetime, timedelta

MIN_TIME_INTERVAL_LISTS = [
    [timedelta(minutes=1), timedelta(minutes=10), timedelta(hours=1), timedelta(days=1)],
    [timedelta(minutes=1), timedelta(hours=1), timedelta(days=1), timedelta(days=2)],
    [timedelta(minutes=1), timedelta(days=1), timedelta(days=2), timedelta(days=3)]
    ] # placeholder

MIN_TIME_INTERVAL = MIN_TIME_INTERVAL_LISTS[0][0]

class User(db.Model, Base) :
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    daily_target: Mapped[int] = mapped_column(Integer, nullable=False, default=20)

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
            "email": self.email,
            "daily_target": self.daily_target
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
    times_remembered_consecutive: Mapped[Integer] = mapped_column(Integer, nullable=False)
    times_forgot: Mapped[Integer] = mapped_column(Integer, nullable=False)
    new: Mapped[Boolean] = mapped_column(Boolean, nullable=False)
    steps: Mapped[Integer] = mapped_column(Integer, nullable=False)

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
                if val < timedelta(days=1):
                    card[col.name] = val.seconds
                else:
                    card[col.name] = val.days * 86400
            else:
                card[col.name] = val
        # return {
        #     col.name: getattr(self, col.name) for col in self.__table__.columns\
        #         if col.name not in exclude
        # }
        card["next_time_intervals"] = list(map(lambda val: val.total_seconds(), self.calculate_time_interval()))
        return card
        
    def get_deck(self):
        deck: Deck = Deck.query.filter_by(id=self.deck_id).first()

        return deck

    def calculate_time_interval(self) -> list:
        def ceildiv(a, b):
            return -(a // -b)

        deck: Deck = self.get_deck()

        if self.new or self.steps < 3:
            return self.get_initial_time_intervals()

        intervals_list = [max(self.time_interval * deck.forgot_multiplier, MIN_TIME_INTERVAL), 
                self.time_interval * deck.hard_multiplier, 
                self.time_interval * deck.okay_multiplier, 
                self.time_interval * deck.easy_multiplier]
        
        for i in range(len(intervals_list)):
            interval: timedelta = intervals_list[i]
            if interval >= timedelta(days=1):
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

        # ensure the intervals are always ascending with no duplicates
        for i in range(len(intervals_list)-1):
            if intervals_list[i] >= intervals_list[i+1]:
                interval: timedelta = intervals_list[i] 
                if interval >= timedelta(days=1):
                    intervals_list[i+1] = interval + timedelta(days=1)
                elif interval >= timedelta(hours=1):
                    intervals_list[i+1] = interval + timedelta(hours=1)
                else:
                    intervals_list[i+1] = interval + timedelta(minutes=1)
        return intervals_list
    
    def get_initial_time_intervals(self) -> list:
        return MIN_TIME_INTERVAL_LISTS[self.steps]

    def update_time_interval(self, response: int) -> None:
        time_interval = self.calculate_time_interval()[response]
        if response == 0:
            self.forgot_card()
        # if time interval is too low, we need to reset steps
        steps_limit = len(MIN_TIME_INTERVAL_LISTS)
        if self.steps >= steps_limit and time_interval < MIN_TIME_INTERVAL_LISTS[-1][1]:
            self.steps = 0
        if self.steps < steps_limit:
            self.steps += response
        
        self.time_interval = time_interval

    def update_time_for_review(self, now:datetime) -> None:
        self.time_for_review = now + self.time_interval

    def update_last_modified(self, now:datetime) -> None:
        deck: Deck = self.get_deck()

        self.last_modified = now
        deck.update_last_modified(now)

    def update_last_reviewed(self, now:datetime) -> None:
        deck: Deck = self.get_deck()

        self.last_reviewed = now
        self.reviews_done += 1
        if self.new:
            self.new = False
        deck.update_last_reviewed(now)

    def forgot_card(self) -> None:
        self.times_forgot += 1
        self.times_remembered_consecutive = 0

    def change_deck(self, new_deck_id:int) -> None:
        self.deck_id = new_deck_id

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
    ignore_review_time: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=False)

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
    
    def update_last_modified(self, now:datetime) -> None:
        self.last_modified = now
    
    def update_last_reviewed(self, now:datetime) -> None:
        self.last_reviewed = now
        self.reviews_done += 1
    
class ReviewCount(db.Model, Base):
    __tablename__ = "review_count"
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    def to_dict(self) -> dict:
        return {
            "date": self.date.isoformat(),
            "review_count": self.review_count,
            "user_id": self.user_id
        }