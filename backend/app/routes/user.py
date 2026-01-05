from uuid import UUID
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.artist import Artist
from app.models.album import Album
from app.models.track import Track
from app.models.playlist import Playlist
from app.models.playlist_track import PlaylistTrack
from app.models.track_like import TrackLike
from app.models.listening_history import ListeningHistory

user_bp = Blueprint("user", __name__, url_prefix="/api")


# =========================
# Artists
# =========================
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


# =========================
# Albums by Artist
# =========================
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
                "release_date": album.release_date.isoformat()
                if album.release_date else None
            }
            for album in albums
        ]
    }, 200


# =========================
# Tracks by Album
# =========================
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


# =========================
# Tracks by Artist
# =========================
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
                "album_id": str(track.album_id)
                if track.album_id else None
            }
            for track in tracks
        ]
    }, 200


# =========================
# Track Details
# =========================
@user_bp.route("/tracks/<track_id>", methods=["GET"])
def get_track_details(track_id):
    track = Track.query.filter_by(id=track_id, is_active=True).first()
    if not track:
        return {"error": "Track not found"}, 404

    return {
        "track": {
            "id": str(track.id),
            "title": track.title,
            "audio_url": track.audio_url,
            "duration_seconds": track.duration_seconds,
            "artist": {
                "id": str(track.artist_id)
            },
            "album": {
                "id": str(track.album_id)
            } if track.album_id else None
        }
    }, 200


# =========================
# Playlists
# =========================
@user_bp.route("/playlists", methods=["POST"])
@jwt_required()
def create_playlist():
    user_id = get_jwt_identity()
    data = request.get_json()

    name = data.get("name")
    if not name:
        return {"error": "Playlist name is required"}, 400

    playlist = Playlist(user_id=user_id, name=name)

    db.session.add(playlist)
    db.session.commit()

    return {
        "message": "Playlist created",
        "playlist_id": str(playlist.id)
    }, 201


@user_bp.route("/playlists/<playlist_id>/tracks", methods=["POST"])
@jwt_required()
def add_track_to_playlist(playlist_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    track_id = data.get("track_id")
    if not track_id:
        return {"error": "track_id is required"}, 400

    playlist = Playlist.query.filter_by(
        id=playlist_id,
        user_id=user_id
    ).first()

    if not playlist:
        return {"error": "Playlist not found"}, 404

    exists = PlaylistTrack.query.filter_by(
        playlist_id=playlist_id,
        track_id=track_id
    ).first()

    if exists:
        return {"error": "Track already in playlist"}, 409

    playlist_track = PlaylistTrack(
        playlist_id=playlist_id,
        track_id=track_id
    )

    db.session.add(playlist_track)
    db.session.commit()

    return {"message": "Track added to playlist"}, 201


@user_bp.route("/playlists/<playlist_id>/tracks/<track_id>", methods=["DELETE"])
@jwt_required()
def remove_track_from_playlist(playlist_id, track_id):
    user_id = get_jwt_identity()

    playlist = Playlist.query.filter_by(
        id=playlist_id,
        user_id=user_id
    ).first()

    if not playlist:
        return {"error": "Playlist not found"}, 404

    playlist_track = PlaylistTrack.query.filter_by(
        playlist_id=playlist_id,
        track_id=track_id
    ).first()

    if not playlist_track:
        return {"error": "Track not in playlist"}, 404

    db.session.delete(playlist_track)
    db.session.commit()

    return {"message": "Track removed from playlist"}, 200


# =========================
# Likes
# =========================
@user_bp.route("/tracks/<track_id>/like", methods=["POST"])
@jwt_required()
def like_track(track_id):
    user_id = get_jwt_identity()

    exists = TrackLike.query.filter_by(
        user_id=user_id,
        track_id=track_id
    ).first()

    if exists:
        return {"error": "Track already liked"}, 409

    like = TrackLike(user_id=user_id, track_id=track_id)

    db.session.add(like)
    db.session.commit()

    return {"message": "Track liked"}, 201


@user_bp.route("/tracks/<track_id>/like", methods=["DELETE"])
@jwt_required()
def unlike_track(track_id):
    user_id = get_jwt_identity()

    like = TrackLike.query.filter_by(
        user_id=user_id,
        track_id=track_id
    ).first()

    if not like:
        return {"error": "Track not liked"}, 404

    db.session.delete(like)
    db.session.commit()

    return {"message": "Track unliked"}, 200


# =========================
# Listening History
# =========================
'''@user_bp.route("/tracks/<track_id>/play", methods=["POST"])
@jwt_required()
def log_track_play(track_id):
    user_id = get_jwt_identity()

    print("🔍 log_track_play user_id =", user_id)

    history = ListeningHistory(
        user_id=user_id,
        track_id=track_id
    )

    db.session.add(history)
    db.session.commit()

    return {"message": "Listening history logged"}, 201
'''


@user_bp.route("/me/likes", methods=["GET"])
@jwt_required()
def get_my_likes():
    user_id = get_jwt_identity()

    likes = TrackLike.query.filter_by(user_id=user_id).all()

    return [
        {"track_id": str(like.track_id)}
        for like in likes
    ], 200


'''
@user_bp.route("/me/history", methods=["GET"])
@jwt_required()
def get_my_listening_history():
    user_id = get_jwt_identity()

    # 🔒 IMPORTANT: convert string → UUID
    user_uuid = UUID(user_id)

    history = (
        db.session.query(
            ListeningHistory.played_at,
            Track.id.label("track_id"),
            Track.title.label("track_title"),
            Artist.name.label("artist_name"),
        )
        .join(Track, Track.id == ListeningHistory.track_id)
        .join(Artist, Artist.id == Track.artist_id)
        .filter(ListeningHistory.user_id == user_uuid)
        .order_by(ListeningHistory.played_at.desc())
        .limit(50)
        .all()
    )

    return [
        {
            "track_id": row.track_id,
            "track_title": row.track_title,
            "artist_name": row.artist_name,
            "played_at": row.played_at.isoformat(),
        }
        for row in history
    ], 200
'''
