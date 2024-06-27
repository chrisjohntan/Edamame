from ..models import Card
from ..extensions import db
from flask import Blueprint, request, jsonify, abort
from http import HTTPStatus
from flask_jwt_extended import jwt_required, get_jwt_identity, get_current_user
import httpx
from ..models import Card, Deck, User
from datetime import datetime, timedelta
from sqlalchemy import and_
from .translation import deepl_translate

cards = Blueprint("cards", __name__)

# Depreciated
# @cards.route("/create_card", methods=["POST"])
# @jwt_required()
# def create_card():
#     current_user = get_current_user()
    
#     header = request.json["header"]
#     body = request.json["body"]
#     header_flipped = request.json["header_flipped"]
#     body_flipped = request.json["body_flipped"]

#     card = Card(
#         header=header,
#         body=body,
#         header_flipped=header_flipped,
#         body_flipped=body_flipped,
#         user_id = current_user.id
#     )

#     db.session.add(card)
#     db.session.commit()

#     return jsonify({
#         "message": "Card created",
#         "card": {
#             "header": header, "body": body, "header_flipped": header_flipped, "body_flipped": body_flipped, "user_id": current_user.id
#         }
#     }), HTTPStatus.CREATED


@cards.route("/create_card/<int:deck_id>", methods=["POST"])
@jwt_required()
def create_card(deck_id):
    current_user = get_current_user()
    now = datetime.now()
    deck = Deck.query.filter_by(user_id=current_user.id, id=deck_id).first()
    
    header = request.json["header"]
    body = request.get_json().get("body", "")
    header_flipped = request.get_json().get("header_flipped", header)
    body_flipped = request.get_json().get("body", body)
    card_type = request.get_json().get("card_type", "manual")
    
    if card_type == "auto":
        try:
            body_flipped = deepl_translate(header)
        except ValueError:
            print("Something went wrong")

    card = Card(
        header=header,
        body=body,
        header_flipped=header_flipped,
        body_flipped=body_flipped,
        user_id=current_user.id,
        deck_id=deck_id,
        time_created=now,
        time_for_review=now+timedelta(0, 60),  # placeholder
        time_interval=timedelta(0, 60),  # placeholder
        last_reviewed=now,  # placeholder
        last_modified=now,
        reviews_done=0
    )

    deck.last_modified=now

    db.session.add(card)
    db.session.commit()

    return jsonify({
        "message": "Card created",
        "card": card.to_dict()
    }), HTTPStatus.CREATED


@cards.route("/get_cards/<int:deck_id>", methods=["GET"])
@jwt_required()
def get_cards(deck_id):
    current_user: User = get_current_user()
    
    # First check if the deck does belong to the user (or if it exists)
    deck_exists: Deck | None = db.session.execute(
        db.select(Deck).where(and_(Deck.id == deck_id, Deck.user_id == current_user.id))
        ).scalar()
    if not deck_exists:
        return jsonify({
            "error": "Deck not found"
        }), HTTPStatus.NOT_FOUND
    
    data = []

    for card in deck_exists.cards:
        data.append(card.to_dict())

    return jsonify({'data': data}),HTTPStatus.OK

@cards.route('/edit_card/<int:id>', methods=["PUT", "PATCH"])
@jwt_required()
def edit_card(id):
    current_user = get_current_user()
    now = datetime.now()
    card: Card = Card.query.filter_by(user_id=current_user.id, id=id).first()
    
    if not card:
        return jsonify({"message": "Card not found"}),HTTPStatus.NOT_FOUND

    deck: Deck = Deck.query.filter_by(user_id=current_user.id, id=card.deck_id).first()

    header = request.get_json().get('header', card.header)
    body = request.get_json().get('body', card.body)
    header_flipped = request.get_json().get('header_flipped', card.header_flipped)
    body_flipped = request.get_json().get('body_flipped', card.body_flipped)

    card.header = header
    card.body = body
    card.header_flipped = header_flipped
    card.body_flipped = body_flipped
    card.last_modified = now
    deck.last_modified = now

    db.session.commit()

    return jsonify({
        "message": "Card edited",
        "card": card.to_dict()
    }), HTTPStatus.OK

@cards.route("/delete_card/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_card(id):
    current_user = get_current_user()
    now = datetime.now()
    card = Card.query.filter_by(user_id=current_user.id, id=id).first()
    
    if not card:
        return jsonify({"message": "Card not found"}),HTTPStatus.NOT_FOUND

    deck = Deck.query.filter_by(user_id=current_user.id, id=card.deck_id).first()

    deck.last_modified = now
    db.session.delete(card)
    db.session.commit()

    return jsonify({}), HTTPStatus.NO_CONTENT

@cards.route('/move_card/<int:id>/<int:deck_id>', methods=["PUT", "PATCH"])
@jwt_required()
def move_card(id, deck_id):
    current_user = get_current_user()
    now = datetime.now()
    card = Card.query.filter_by(user_id=current_user.id, id=id).first()
    
    if not card:
        return jsonify({"message": "Card not found"}),HTTPStatus.NOT_FOUND
    
    new_deck = Deck.query.filter_by(user_id=current_user.id, id=deck_id).first()
    prev_deck = Deck.query.filter_by(user_id=current_user.id, id=card.deck_id).first()
    
    if not new_deck:
        return jsonify({"message": "Deck not found"}),HTTPStatus.NOT_FOUND

    card.deck_id = new_deck.id
    prev_deck.last_modified = now
    new_deck.last_modified = now
    db.session.commit()
    return jsonify({
        "message": "Card moved",
        "deck": {
            "deck_id": new_deck.id
        }
    }), HTTPStatus.OK


@cards.route("/next_card/<int:deck_id>", methods=["PUT", "PATCH"])
@jwt_required()
def next_card(deck_id):
    current_user = get_current_user()
    now = datetime.now()
    
    deck = Deck.query.filter_by(user_id=current_user.id, id=deck_id).first()
    if not deck:
        return jsonify({"message": "Deck not found"}),HTTPStatus.NOT_FOUND

    cards = Card.query.filter_by(user_id=current_user.id, deck_id=deck_id)
    
    if not cards.first():
        return jsonify({
            "message": "No cards in deck",
        }), HTTPStatus.NOT_FOUND

    # return json message for testing
    # return jsonify({
    #     "cards": list(map(lambda x: x.to_dict(), cards))
    # }), HTTPStatus.OK

    card = cards.order_by(Card.time_for_review.asc()).first()

    if card.time_for_review >= now:
        return jsonify({
        "message": "No cards due for review now",
        }), HTTPStatus.OK
    return jsonify({
        "message": "Next Card",
        "card": card.to_dict()
    }), HTTPStatus.OK