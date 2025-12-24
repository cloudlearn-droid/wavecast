from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.artist import Artist
from app.models.album import Album
from app.models.track import Track   # ✅ NEW IMPORT
from app.utils.admin_guard import admin_required

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


# =========================
# Create Artist
# =========================
@admin_bp.route("/artists", methods=["POST"])
@jwt_required()
@admin_required()
def create_artist():
    data = request.get_json()

    name = data.get("name")
    bio = data.get("bio")
    image_url = data.get("image_url")

    if not name:
        return {"error": "Artist name is required"}, 400

    artist = Artist(
        name=name,
        bio=bio,
        image_url=image_url
    )

    db.session.add(artist)
    db.session.commit()

    return {
        "message": "Artist created successfully",
        "artist_id": str(artist.id)
    }, 201


# =========================
# Create Album
# =========================
@admin_bp.route("/albums", methods=["POST"])
@jwt_required()
@admin_required()
def create_album():
    data = request.get_json()

    title = data.get("title")
    artist_id = data.get("artist_id")
    cover_image_url = data.get("cover_image_url")
    release_date = data.get("release_date")

    if not title or not artist_id:
        return {"error": "title and artist_id are required"}, 400

    artist = Artist.query.get(artist_id)
    if not artist:
        return {"error": "Artist not found"}, 404

    album = Album(
        title=title,
        artist_id=artist_id,
        cover_image_url=cover_image_url,
        release_date=release_date
    )

    db.session.add(album)
    db.session.commit()

    return {
        "message": "Album created successfully",
        "album_id": str(album.id)
    }, 201


# =========================
# Create Track
# =========================
@admin_bp.route("/tracks", methods=["POST"])
@jwt_required()
@admin_required()
def create_track():
    data = request.get_json()

    title = data.get("title")
    artist_id = data.get("artist_id")
    album_id = data.get("album_id")  # optional
    audio_url = data.get("audio_url")
    duration_seconds = data.get("duration_seconds")

    if not title or not artist_id or not audio_url or not duration_seconds:
        return {
            "error": "title, artist_id, audio_url, duration_seconds are required"
        }, 400

    artist = Artist.query.get(artist_id)
    if not artist:
        return {"error": "Artist not found"}, 404

    if album_id:
        album = Album.query.get(album_id)
        if not album:
            return {"error": "Album not found"}, 404

    track = Track(
        title=title,
        artist_id=artist_id,
        album_id=album_id,
        audio_url=audio_url,
        duration_seconds=duration_seconds
    )

    db.session.add(track)
    db.session.commit()

    return {
        "message": "Track created successfully",
        "track_id": str(track.id)
    }, 201
