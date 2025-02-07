from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    github_id = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(100))
    email = db.Column(db.String(120))
    avatar_url = db.Column(db.String(200))
    access_token = db.Column(db.String(200))
