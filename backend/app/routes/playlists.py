from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.playlist import Playlist
from app.models.track import Track
from app.models.playlist_track import PlaylistTrack
import uuid

playlists_bp = Blueprint("playlists", __name__, url_prefix="/playlists")


@playlists_bp.route("/", methods=["GET"])
@jwt_required()
def get_playlists():
    user_id = uuid.UUID(get_jwt_identity())

    playlists = Playlist.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": str(p.id),
            "name": p.name
        }
        for p in playlists
    ])


@playlists_bp.route("/", methods=["POST"])
@jwt_required()
def create_playlist():
    user_id = uuid.UUID(get_jwt_identity())
    data = request.get_json()

    name = data.get("name")
    if not name:
        return {"error": "Playlist name required"}, 400

    playlist = Playlist(
        name=name,
        user_id=user_id
    )
    db.session.add(playlist)
    db.session.commit()

    return {
        "id": str(playlist.id),
        "name": playlist.name
    }, 201


@playlists_bp.route("/<playlist_id>", methods=["GET"])
@jwt_required()
def get_playlist_detail(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)

    tracks = (
        db.session.query(Track)
        .join(PlaylistTrack)
        .filter(PlaylistTrack.playlist_id == playlist_id)
        .all()
    )

    return jsonify({
        "id": str(playlist.id),
        "name": playlist.name,
        "tracks": [
            {
                "id": str(t.id),
                "title": t.title,
                "audio_url": t.audio_url,
                "artist_id": str(t.artist_id),
                "album_id": str(t.album_id) if t.album_id else None,
            }
            for t in tracks
        ]
    })


@playlists_bp.route("/<playlist_id>/tracks", methods=["POST"])
@jwt_required()
def add_track_to_playlist(playlist_id):
    data = request.get_json()
    track_id = data.get("track_id")

    if not track_id:
        return {"error": "track_id required"}, 400

    existing = PlaylistTrack.query.filter_by(
        playlist_id=playlist_id,
        track_id=track_id
    ).first()

    if existing:
        return {"message": "Track already in playlist"}, 200

    pt = PlaylistTrack(
        playlist_id=playlist_id,
        track_id=track_id
    )
    db.session.add(pt)
    db.session.commit()

    return {"message": "Track added"}, 201


@playlists_bp.route("/<playlist_id>/tracks/<track_id>", methods=["DELETE"])
@jwt_required()
def remove_track_from_playlist(playlist_id, track_id):
    pt = PlaylistTrack.query.filter_by(
        playlist_id=playlist_id,
        track_id=track_id
    ).first()

    if pt:
        db.session.delete(pt)
        db.session.commit()

    return {"message": "Track removed"}, 200
