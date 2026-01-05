from app.extensions import db
from datetime import datetime
import uuid


class TrackLike(db.Model):
    __tablename__ = "track_likes"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True),
                        db.ForeignKey("users.id"), nullable=False)
    track_id = db.Column(db.UUID(as_uuid=True),
                         db.ForeignKey("tracks.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "track_id",
                            name="unique_user_track_like"),
    )
