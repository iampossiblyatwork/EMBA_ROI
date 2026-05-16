from __future__ import annotations

from flask import Blueprint, jsonify, request

from .calculator import build_projection
from .schemas import ScenarioInput, validate

api_bp = Blueprint("api", __name__)


@api_bp.post("/calculate")
def calculate():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"errors": {"_": "Request body must be JSON object."}}), 400

    try:
        scenario = ScenarioInput.from_payload(payload)
    except ValueError as exc:
        return jsonify({"errors": {"_": str(exc)}}), 400

    errors = validate(scenario)
    if errors:
        return jsonify({"errors": errors}), 400

    result = build_projection(scenario)
    return jsonify(result.to_dict()), 200
