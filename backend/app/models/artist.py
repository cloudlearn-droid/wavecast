import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class Artist(db.Model):
    __tablename__ = "artists"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = db.Column(db.String(150), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.Text, nullable=True)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<Artist {self.name}>"
