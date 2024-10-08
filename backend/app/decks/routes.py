from ..extensions import db
from ..models import Card, Deck, User
from flask import Blueprint, request, jsonify
from http import HTTPStatus
from flask_jwt_extended import jwt_required, get_current_user
from datetime import datetime
from sqlalchemy import and_

# placeholder
DEFAULT_TIME_INTERVAL_MULTIPLIER = {
    1: 0,    # forgot
    2: 1.2,  # hard
    3: 2.5,  # okay
    4: 3.25  # easy
}

decks = Blueprint("decks", __name__)

@decks.route("/create_deck", methods=["POST"])
@jwt_required()
def create_deck():
    current_user = get_current_user()
    now = datetime.now()
    
    deck_name = request.json["deck_name"]
    name_exists = db.session.execute(
        db.select(Deck).where(and_(Deck.deck_name == deck_name, Deck.user == current_user))
        ).scalar()
    if name_exists:
        return jsonify({
            "message": "A deck with that name already exists"
        }), HTTPStatus.CONFLICT

    deck = Deck(
        deck_name=deck_name,
        user_id=current_user.id,
        time_created=now,
        last_reviewed=now,  # placeholder
        last_modified=now,
        reviews_done=0,
        forgot_multiplier=DEFAULT_TIME_INTERVAL_MULTIPLIER[1],
        hard_multiplier=DEFAULT_TIME_INTERVAL_MULTIPLIER[2],
        okay_multiplier=DEFAULT_TIME_INTERVAL_MULTIPLIER[3],
        easy_multiplier=DEFAULT_TIME_INTERVAL_MULTIPLIER[4],
    )

    db.session.add(deck)
    db.session.commit()

    return jsonify({
        "message": "Deck created",
        "deck": deck.to_dict()
    }), HTTPStatus.CREATED
    
@decks.route("/get_decks", methods=["GET"])
@jwt_required()
def get_decks():
    current_user: User = get_current_user()
    decks = current_user.user_decks
    return jsonify([deck.to_dict() for deck in decks]), HTTPStatus.OK
    
@decks.route('/edit_deck/<int:deck_id>', methods=["PUT"])
@jwt_required()
def edit_deck(deck_id):
    current_user: User = get_current_user()
    now = datetime.now()
    deck: Deck = Deck.query.filter_by(user_id=current_user.id, id=deck_id).first()
    
    if not deck:
        return jsonify({"message": "Deck not found"}),HTTPStatus.NOT_FOUND

    deck_name = request.get_json().get('deck_name', deck.deck_name)
    forgot_multiplier = request.get_json().get('forgot_multiplier', deck.forgot_multiplier)
    hard_multiplier = request.get_json().get('hard_multiplier', deck.hard_multiplier)
    okay_multiplier = request.get_json().get('okay_multiplier', deck.okay_multiplier)
    easy_multiplier = request.get_json().get('easy_multiplier', deck.easy_multiplier)

    # # Check if user already have a deck with the same name
    # name_exists = db.session.execute(
    #     db.select(Deck).where(and_(Deck.deck_name == deck_name, Deck.user == current_user))
    #     ).scalar()
    # if name_exists:
    #     return jsonify({
    #         "message": "A deck with that name already exists"
    #     }), HTTPStatus.CONFLICT
    
    # Check if any multipliers are not float
    for multiplier in (forgot_multiplier, hard_multiplier, okay_multiplier, easy_multiplier):
        if not isinstance(multiplier, (int, float)):
            return jsonify({
            "message": "Please ensure all time interval multiplier values to a float or an integer",
            }), HTTPStatus.NOT_ACCEPTABLE

    if not forgot_multiplier < hard_multiplier < okay_multiplier < easy_multiplier:
        return jsonify({
            "message": "Please ensure the time interval multiplier values are in ascending order",
            }), HTTPStatus.NOT_ACCEPTABLE

    deck.deck_name = deck_name
    deck.forgot_multiplier = forgot_multiplier
    deck.hard_multiplier = hard_multiplier
    deck.okay_multiplier = okay_multiplier
    deck.easy_multiplier = easy_multiplier
    deck.update_last_modified(now)
    
    db.session.commit()

    return jsonify({
        "message": "Deck edited",
        "deck": {
            "deck_name": deck_name, "user_id": current_user.id
        }
    }), HTTPStatus.OK

@decks.route("/delete_deck/<int:deck_id>", methods=["DELETE"])
@jwt_required()
def delete_deck(deck_id):
    current_user = get_current_user()
    deck = Deck.query.filter_by(user_id=current_user.id, id=deck_id).first()
    
    if not deck:
        return jsonify({"message": "Deck not found"}),HTTPStatus.NOT_FOUND

    db.session.delete(deck)
    db.session.commit()

    return jsonify({}), HTTPStatus.NO_CONTENT


@decks.route("/ignore_wait/<int:deck_id>", methods=["POST"])
@jwt_required()
def ignore_wait(deck_id):
    current_user = get_current_user()
    deck: Deck = Deck.query.filter_by(user_id=current_user.id, id=deck_id).first()
    if not deck:
        return jsonify({"message": "Deck not found"}),HTTPStatus.NOT_FOUND
    
    deck.ignore_review_time = request.json["ignore_review_time"]
    deck.update_last_modified(datetime.now())
    db.session.commit()
    
    return jsonify({
        "message": "Wait time updated",
        "deck": deck.to_dict()
    }), HTTPStatus.OK