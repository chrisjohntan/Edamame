from ..extensions import db
from ..models import ReviewCount
import datetime as dt
from sqlalchemy import and_
from typing import List

def addDailyCount(user_id: int):
    today = dt.date.today()
    record_exists: ReviewCount = db.session.query(
        db.select(ReviewCount)
        .where(
            and_(
                ReviewCount.user_id == user_id,
                ReviewCount.date == today)
            )
    ).scalar()
    if (record_exists):
        record_exists.review_count += 1
    else:
        record_exists = ReviewCount(
            date=today,
            review_count=1
        )
        db.session.add(record_exists)
    db.session.commit()
    
    return 

def getReviewCounts(user_id: int, start_date: dt.date, end_date: dt.date):
    records: List[ReviewCount] = db.session.query(
        db.select(ReviewCount)
        .where(
            and_(
                ReviewCount.user_id == user_id,
                ReviewCount.date >= start_date,
                ReviewCount.date <= end_date
            )
        )
    ).all()
    return records