from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class PlaylistTrack(db.Model):
    __tablename__ = "playlist_tracks"

    playlist_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("playlists.id"),
        primary_key=True
    )

    track_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("tracks.id"),
        primary_key=True
    )

    added_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<PlaylistTrack playlist={self.playlist_id} track={self.track_id}>"
