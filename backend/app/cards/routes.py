from ..models import Card
from ..extensions import db
from flask import Blueprint, request, jsonify, abort
from http import HTTPStatus
from flask_jwt_extended import jwt_required, get_jwt_identity, get_current_user
import httpx
from ..models import Card, Deck



cards = Blueprint("cards", __name__)
decks = Blueprint("decks", __name__)

# # To be depreciated
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
    
    header = request.json["header"]
    body = request.json["body"]
    header_flipped = request.json["header_flipped"]
    body_flipped = request.json["body_flipped"]

    card = Card(
        header=header,
        body=body,
        header_flipped=header_flipped,
        body_flipped=body_flipped,
        user_id = current_user.id,
        deck_id = deck_id
    )

    db.session.add(card)
    db.session.commit()

    return jsonify({
        "message": "Card created",
        "card": {
            "header": header, "body": body, "header_flipped": header_flipped, "body_flipped": body_flipped, "user_id": current_user.id, "deck_id": deck_id
        }
    }), HTTPStatus.CREATED


@cards.route("/get_cards", methods=["GET"])
@jwt_required()
def get_cards():
    current_user = get_current_user()
    user_cards = Card.query.filter_by(user_id=current_user.id)
    
    data = []

    for card in user_cards:
        data.append({
        "id": card.id,
        "header": card.header, 
        "body": card.body, 
        "header_flipped": card.header_flipped, 
        "body_flipped": card.body_flipped, 
        "user_id": card.user_id
        })

    return jsonify({'data': data}),HTTPStatus.OK

@cards.route('/edit_card/<int:id>', methods=["PUT", "PATCH"])
@jwt_required()
def edit_card(id):
    current_user = get_current_user()
    card = Card.query.filter_by(user_id=current_user.id, id=id).first()
    
    if not card:
        return jsonify({"message": "Card not found"}),HTTPStatus.NOT_FOUND

    header = request.get_json().get('header', card.header)
    body = request.get_json().get('body', card.body)
    header_flipped = request.get_json().get('header_flipped', card.header_flipped)
    body_flipped = request.get_json().get('body_flipped', card.body_flipped)

    card.header = header
    card.body = body
    card.header_flipped = header_flipped
    card.body_flipped = body_flipped

    db.session.commit()

    return jsonify({
        "message": "Card edited",
        "card": {
            "header": header, "body": body, "header_flipped": header_flipped, "body_flipped": body_flipped, "user_id": current_user.id
        }
    }), HTTPStatus.OK

@cards.route("/delete_card/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_cards(id):
    current_user = get_current_user()
    card = Card.query.filter_by(user_id=current_user.id, id=id).first()
    
    if not card:
        return jsonify({"message": "Card not found"}),HTTPStatus.NOT_FOUND

    db.session.delete(card)
    db.session.commit()

    return jsonify({}), HTTPStatus.NO_CONTENT


@cards.route("/create_deck", methods=["POST"])
@jwt_required()
def create_deck():
    current_user = get_current_user()
    
    deck_name = request.json["deck_name"]

    deck = Deck(
        deck_name=deck_name,
        user_id = current_user.id
    )

    db.session.add(deck)
    db.session.commit()

    return jsonify({
        "message": "Deck created",
        "deck": {
            "deck_name": deck_name, "user_id": current_user.id
        }
    }), HTTPStatus.CREATED