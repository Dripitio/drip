import os

from flask import Flask
from flask.ext.login import LoginManager

from drip.db.mongo import create_mongo
from drip.db.user import User
from drip.views.index import bp_index

PATH = os.path.dirname(os.path.realpath(__file__))


def get_user(user_id):
    """ Get user from MongoDB. """
    u = User.objects(id=user_id).first()
    return u


def create_app(env=''):
    app = Flask(__name__)

    app.config.from_object('drip.config.Config')

    app.template_folder = os.path.join(PATH, 'templates')

    if not env == 'TESTING':
        db = create_mongo(app)

    login_manager = LoginManager()
    login_manager.init_app(app)
    # noinspection PyTypeChecker
    login_manager.user_loader(get_user)
    login_manager.login_view = "user.login"

    # views with jinja templates
    app.register_blueprint(bp_index)
    return app
