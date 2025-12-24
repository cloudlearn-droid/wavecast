import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class Album(db.Model):
    __tablename__ = "albums"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = db.Column(db.String(200), nullable=False)

    artist_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("artists.id"),
        nullable=False
    )

    cover_image_url = db.Column(db.Text, nullable=True)
    release_date = db.Column(db.Date, nullable=True)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<Album {self.title}>"
