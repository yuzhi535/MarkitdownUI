from flask import Blueprint, current_app, redirect, url_for, request
from flask_login import LoginManager, login_user, logout_user
from flask_oauthlib.client import OAuth
from models import db, User

auth = Blueprint('auth', __name__)
oauth = OAuth()
login_manager = LoginManager()

github = oauth.remote_app(
    'github',
    consumer_key='{{GITHUB_CLIENT_ID}}',
    consumer_secret='{{GITHUB_CLIENT_SECRET}}',
    request_token_params={'scope': 'user:email'},
    base_url='https://api.github.com/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize'
)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@auth.route('/login/github')
def github_login():
    return github.authorize(callback=url_for('auth.github_callback', _external=True))

@auth.route('/login/github/callback')
def github_callback():
    resp = github.authorized_response()
    if resp is None or resp.get('access_token') is None:
        return 'Access denied: reason={}'.format(
            request.args['error_reason'] if request.args else 'unknown'
        )
    
    me = github.get('user')
    user = User.query.filter_by(github_id=str(me.data['id'])).first()
    
    if not user:
        user = User(
            github_id=str(me.data['id']),
            username=me.data['login'],
            email=me.data.get('email'),
            avatar_url=me.data['avatar_url'],
            access_token=resp['access_token']
        )
        db.session.add(user)
        db.session.commit()
    
    login_user(user)
    return redirect(url_for('index'))

@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))
