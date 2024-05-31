from ..models import Card
from ..extensions import db
from flask import Blueprint, request, jsonify, abort
from http import HTTPStatus
from flask_jwt_extended import jwt_required
import httpx
from ..models import Card



cards = Blueprint("cards", __name__)

@cards.route("/create_card", methods=["POST"])
@jwt_required()
def create_card():
    header = request.json["header"]
    body = request.json["body"]
    header_flipped = request.json["header_flipped"]
    body_flipped = request.json["body_flipped"]

    card = Card(
        header=header,
        body=body,
        header_flipped=header_flipped,
        body_flipped=body_flipped
    )

    db.session.add(card)
    db.session.commit()

    return jsonify({
        "message": "Card created",
        "card": {
            "header": header, "body": body, "header_flipped": header_flipped, "body_flipped": body_flipped
        }
    }), HTTPStatus.CREATED


# @cards.route("/card", methods=["GET"])
# @jwt_required()
# def single_card():
#     pass

# @cards.route("/delete_card", methods=["DELETE"])
# @jwt_required()
# def delete_cards():
#     pass