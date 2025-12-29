import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class ListeningHistory(db.Model):
    __tablename__ = "listening_history"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id"),
        nullable=False
    )

    track_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("tracks.id"),
        nullable=False
    )

    played_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<ListeningHistory user={self.user_id} track={self.track_id}>"
