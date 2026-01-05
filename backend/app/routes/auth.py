from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError, OperationalError
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    try:
        existing = User.query.filter_by(email=email).first()
        if existing:
            return {"error": "User already exists"}, 409

        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            is_admin=False
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "Signup successful"}, 201

    except IntegrityError:
        db.session.rollback()
        return {"error": "User already exists"}, 409

    except OperationalError as e:
        db.session.rollback()
        print("DB ERROR:", e)
        return {"error": "Database temporarily unavailable"}, 503

    except Exception as e:
        db.session.rollback()
        print("UNEXPECTED ERROR:", e)
        return {"error": "Signup failed"}, 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    try:
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return {"error": "Invalid credentials"}, 401

        token = create_access_token(identity=str(user.id))

        return {
            "access_token": token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "is_admin": user.is_admin
            }
        }, 200

    except OperationalError as e:
        print("DB ERROR:", e)
        return {"error": "Database temporarily unavailable"}, 503
