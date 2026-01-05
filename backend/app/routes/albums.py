from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.album import Album
from app.models.track import Track

albums_bp = Blueprint("albums", __name__, url_prefix="/albums")


@albums_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_albums():
    albums = Album.query.filter_by(is_active=True).all()

    return jsonify([
        {
            "id": str(a.id),
            "title": a.title,
            "artist_id": str(a.artist_id),
            "cover_image_url": a.cover_image_url
        }
        for a in albums
    ])


@albums_bp.route("/<album_id>", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_album_detail(album_id):
    album = Album.query.get_or_404(album_id)

    return jsonify({
        "id": str(album.id),
        "title": album.title,
        "artist_id": str(album.artist_id),
        "cover_image_url": album.cover_image_url
    })


@albums_bp.route("/<album_id>/tracks", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_album_tracks(album_id):
    tracks = Track.query.filter_by(
        album_id=album_id,
        is_active=True
    ).all()

    return jsonify([
        {
            "id": str(t.id),
            "title": t.title,
            "audio_url": t.audio_url,
            "duration_seconds": t.duration_seconds,
            "artist_id": str(t.artist_id),
            "album_id": str(t.album_id)
        }
        for t in tracks
    ])
