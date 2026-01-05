from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.track_like import TrackLike
import uuid

likes_bp = Blueprint("likes", __name__, url_prefix="/tracks")


@likes_bp.route("/<track_id>/like", methods=["POST"])
@jwt_required()
def like_track(track_id):
    user_id = uuid.UUID(get_jwt_identity())
    track_uuid = uuid.UUID(track_id)   # ✅ FIX

    existing = TrackLike.query.filter_by(
        user_id=user_id,
        track_id=track_uuid
    ).first()

    if existing:
        return {"message": "Already liked"}, 200

    like = TrackLike(
        user_id=user_id,
        track_id=track_uuid
    )
    db.session.add(like)
    db.session.commit()

    return {"message": "Track liked"}, 201


@likes_bp.route("/<track_id>/like", methods=["DELETE"])
@jwt_required()
def unlike_track(track_id):
    user_id = uuid.UUID(get_jwt_identity())
    track_uuid = uuid.UUID(track_id)   # ✅ FIX

    like = TrackLike.query.filter_by(
        user_id=user_id,
        track_id=track_uuid
    ).first()

    if like:
        db.session.delete(like)
        db.session.commit()

    return {"message": "Track unliked"}, 200


@likes_bp.route("/likes", methods=["GET"])
@jwt_required()
def my_likes():
    user_id = uuid.UUID(get_jwt_identity())

    likes = TrackLike.query.filter_by(user_id=user_id).all()
    return jsonify([str(l.track_id) for l in likes])
