from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.artist import Artist
from app.models.track import Track
from app.models.album import Album

artists_bp = Blueprint("artists", __name__, url_prefix="/artists")


@artists_bp.route("/", methods=["GET"])
@jwt_required()
def get_artists():
    artists = Artist.query.filter_by(is_active=True).all()

    return jsonify([
        {
            "id": str(a.id),
            "name": a.name,
            "image_url": a.image_url
        }
        for a in artists
    ])


@artists_bp.route("/<artist_id>", methods=["GET"])
@jwt_required()
def get_artist_detail(artist_id):
    artist = Artist.query.get_or_404(artist_id)

    return jsonify({
        "id": str(artist.id),
        "name": artist.name,
        "bio": artist.bio,
        "image_url": artist.image_url
    })


@artists_bp.route("/<artist_id>/tracks", methods=["GET"])
@jwt_required()
def get_artist_tracks(artist_id):
    tracks = Track.query.filter_by(
        artist_id=artist_id,
        is_active=True
    ).all()

    return jsonify([
        {
            "id": str(t.id),
            "title": t.title,
            "audio_url": t.audio_url,
            "duration_seconds": t.duration_seconds,
            "artist_id": str(t.artist_id),
            "album_id": str(t.album_id) if t.album_id else None
        }
        for t in tracks
    ])


@artists_bp.route("/<artist_id>/albums", methods=["GET"])
@jwt_required()
def get_artist_albums(artist_id):
    albums = Album.query.filter_by(
        artist_id=artist_id,
        is_active=True
    ).all()

    return jsonify([
        {
            "id": str(a.id),
            "title": a.title,
            "cover_image_url": a.cover_image_url
        }
        for a in albums
    ])
