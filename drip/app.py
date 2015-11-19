import os

import newrelic.agent
from flask import Flask
from flask.ext.login import LoginManager

from drip.db.mongo import create_mongo
from drip.db.user import User
from drip.views.dashboard import dashboard
from drip.views.main import main
from drip.views.integrations_shopify import shopify

PATH = os.path.dirname(os.path.realpath(__file__))


def get_user(user_id):
    """ Get user from MongoDB. """
    u = User.objects(id=user_id).first()
    return u


def create_app(env=''):
    app = Flask(__name__)

    if env == 'DEVELOPMENT' or env == 'TESTING':
        app.config.from_object('drip.config.Development')
    else:
        app.config.from_object('drip.config.Production')


    # Monitoring.
    newrelic.agent.initialize(os.path.join(PATH, '..', 'newrelic-web.ini'), 'development')

    app.template_folder = os.path.join(PATH, 'templates')

    if not env == 'TESTING':
        db = create_mongo(app)

    login_manager = LoginManager()
    login_manager.init_app(app)
    # noinspection PyTypeChecker
    login_manager.user_loader(get_user)
    login_manager.login_view = "user.login"

    # views with jinja templates
    app.register_blueprint(main)
    app.register_blueprint(shopify)
    app.register_blueprint(dashboard)
    return app
