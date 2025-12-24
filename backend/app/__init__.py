from flask import Flask, app
from dotenv import load_dotenv
import os

from app.extensions import db, migrate, jwt
from app import models

load_dotenv()


def create_app():
    app = Flask(__name__)   # ✅ create app FIRST

    # Config
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")

    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True
    }

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Blueprints (AFTER app exists)
    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    from app.routes.user import user_bp
    app.register_blueprint(user_bp)

    return app
