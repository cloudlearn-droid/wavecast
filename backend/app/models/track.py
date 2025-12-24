import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class Track(db.Model):
    __tablename__ = "tracks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = db.Column(db.String(200), nullable=False)

    artist_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("artists.id"),
        nullable=False
    )

    album_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("albums.id"),
        nullable=True
    )

    audio_url = db.Column(db.Text, nullable=False)
    duration_seconds = db.Column(db.Integer, nullable=False)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<Track {self.title}>"
