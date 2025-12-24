from werkzeug.security import generate_password_hash

from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

with app.app_context():
    existing_admin = User.query.filter_by(email="admin@wavecast.com").first()

    if existing_admin:
        print("⚠️ Admin user already exists")
    else:
        admin = User(
            email="admin@wavecast.com",
            password_hash=generate_password_hash("admin123"),
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin user created")
