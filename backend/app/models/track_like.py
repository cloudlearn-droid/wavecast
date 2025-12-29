from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class TrackLike(db.Model):
    __tablename__ = "track_likes"

    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        primary_key=True
    )

    track_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("tracks.id"),
        primary_key=True
    )

    liked_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<TrackLike user={self.user_id} track={self.track_id}>"
