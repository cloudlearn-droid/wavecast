import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.Text, nullable=False)
    name = db.Column(db.String(100))

    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    def __repr__(self):
        return f"<User {self.email}>"
