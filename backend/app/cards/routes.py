from ..models import Card
from ..extensions import db
from flask import Blueprint, request, jsonify, abort
from http import HTTPStatus
from flask_jwt_extended import jwt_required
import httpx



cards = Blueprint("cards", __name__)

@cards.route("/create_card", methods=["POST"])
@jwt_required
def create_card():
    pass

@cards.route("/card", methods=["GET"])
@jwt_required
def single_card():
    pass

@cards.route("/cards", methods=["GET"])
@jwt_required
def cards():
    pass

@cards.route("/delete_card", methods=["DELETE"])
@jwt_required
def delete_cards():
    pass