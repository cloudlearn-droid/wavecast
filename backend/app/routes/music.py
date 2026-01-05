from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.track import Track

music_bp = Blueprint("music", __name__, url_prefix="/tracks")


@music_bp.route("/", methods=["GET"])
@jwt_required()
def get_tracks():
    tracks = Track.query.filter_by(is_active=True).all()

    results = []
    for track in tracks:
        results.append({
            "id": str(track.id),
            "title": track.title,
            "artist_id": str(track.artist_id) if track.artist_id else None,
            "album_id": str(track.album_id) if track.album_id else None,
            "audio_url": track.audio_url,
            "duration_seconds": track.duration_seconds
        })

    return jsonify(results), 200
