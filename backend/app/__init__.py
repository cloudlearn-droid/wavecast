from flask import Flask, app, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from app.extensions import db, migrate, jwt

load_dotenv()


def create_app():
    app = Flask(__name__)

    # --------------------
    # Config
    # --------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")

    # --------------------
    # Enable CORS (GLOBAL)
    # --------------------
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True
    )

    # --------------------
    # Init extensions
    # --------------------
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # --------------------
    # Health Check Route
    # --------------------
    @app.route("/", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "WaveCast backend"})

    # --------------------
    # Register Blueprints
    # --------------------
    from app.routes.auth import auth_bp
    from app.routes.playlists import playlists_bp
    from app.routes.music import music_bp
    from app.routes.artists import artists_bp
    from app.routes.likes import likes_bp
    from app.routes.albums import albums_bp

    app.register_blueprint(albums_bp)
    app.register_blueprint(likes_bp)
    app.register_blueprint(artists_bp)
    app.register_blueprint(music_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(playlists_bp)

    return app
