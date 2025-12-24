from flask import Blueprint
from app.models.artist import Artist
from app.models.album import Album
from app.models.track import Track

user_bp = Blueprint("user", __name__, url_prefix="/api")


@user_bp.route("/artists", methods=["GET"])
def list_artists():
    artists = (
        Artist.query
        .filter_by(is_active=True)
        .order_by(Artist.created_at.desc())
        .all()
    )

    return {
        "artists": [
            {
                "id": str(artist.id),
                "name": artist.name,
                "bio": artist.bio,
                "image_url": artist.image_url
            }
            for artist in artists
        ]
    }, 200


@user_bp.route("/artists/<artist_id>/albums", methods=["GET"])
def list_albums_by_artist(artist_id):
    artist = Artist.query.filter_by(id=artist_id, is_active=True).first()
    if not artist:
        return {"error": "Artist not found"}, 404

    albums = (
        Album.query
        .filter_by(artist_id=artist_id, is_active=True)
        .order_by(Album.created_at.desc())
        .all()
    )

    return {
        "artist": {
            "id": str(artist.id),
            "name": artist.name
        },
        "albums": [
            {
                "id": str(album.id),
                "title": album.title,
                "cover_image_url": album.cover_image_url,
                "release_date": album.release_date.isoformat() if album.release_date else None
            }
            for album in albums
        ]
    }, 200


@user_bp.route("/albums/<album_id>/tracks", methods=["GET"])
def list_tracks_by_album(album_id):
    album = Album.query.filter_by(id=album_id, is_active=True).first()
    if not album:
        return {"error": "Album not found"}, 404

    tracks = (
        Track.query
        .filter_by(album_id=album_id, is_active=True)
        .order_by(Track.created_at.asc())
        .all()
    )

    return {
        "album": {
            "id": str(album.id),
            "title": album.title
        },
        "tracks": [
            {
                "id": str(track.id),
                "title": track.title,
                "audio_url": track.audio_url,
                "duration_seconds": track.duration_seconds
            }
            for track in tracks
        ]
    }, 200


@user_bp.route("/artists/<artist_id>/tracks", methods=["GET"])
def list_tracks_by_artist(artist_id):
    artist = Artist.query.filter_by(id=artist_id, is_active=True).first()
    if not artist:
        return {"error": "Artist not found"}, 404

    tracks = (
        Track.query
        .filter_by(artist_id=artist_id, is_active=True)
        .order_by(Track.created_at.desc())
        .all()
    )

    return {
        "artist": {
            "id": str(artist.id),
            "name": artist.name
        },
        "tracks": [
            {
                "id": str(track.id),
                "title": track.title,
                "audio_url": track.audio_url,
                "duration_seconds": track.duration_seconds,
                "album_id": str(track.album_id) if track.album_id else None
            }
            for track in tracks
        ]
    }, 200


@user_bp.route("/tracks/<track_id>", methods=["GET"])
def get_track_details(track_id):
    track = (
        Track.query
        .filter_by(id=track_id, is_active=True)
        .first()
    )

    if not track:
        return {"error": "Track not found"}, 404

    return {
        "track": {
            "id": str(track.id),
            "title": track.title,
            "audio_url": track.audio_url,
            "duration_seconds": track.duration_seconds,
            "artist": {
                "id": str(track.artist_id),
            },
            "album": {
                "id": str(track.album_id)
            } if track.album_id else None
        }
    }, 200
