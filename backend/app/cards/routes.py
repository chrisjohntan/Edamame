from ..models import Card
from ..extensions import db
from flask import Blueprint, request, jsonify, abort
from http import HTTPStatus
from flask_jwt_extended import jwt_required, get_jwt_identity
import httpx
from ..models import Card



cards = Blueprint("cards", __name__)

@cards.route("/create_card", methods=["POST"])
@jwt_required()
def create_card():
    current_user = get_jwt_identity()

    header = request.json["header"]
    body = request.json["body"]
    header_flipped = request.json["header_flipped"]
    body_flipped = request.json["body_flipped"]

    card = Card(
        header=header,
        body=body,
        header_flipped=header_flipped,
        body_flipped=body_flipped,
        user_id = current_user
    )

    db.session.add(card)
    db.session.commit()

    return jsonify({
        "message": "Card created",
        "card": {
            "header": header, "body": body, "header_flipped": header_flipped, "body_flipped": body_flipped, "user_id": current_user
        }
    }), HTTPStatus.CREATED


@cards.route("/get_cards", methods=["GET"])
@jwt_required()
def get_cards():
    current_user = get_jwt_identity()

    user_cards = Card.query.filter_by(user_id=current_user)
    
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

# @cards.route("/delete_card", methods=["DELETE"])
# @jwt_required()
# def delete_cards():
#     pass