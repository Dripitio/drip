import os

from flask import Flask
from flask.ext.restful import Api

from drip.views.index import bp_index
from drip.db.mongo import create_mongo

PATH = os.path.dirname(os.path.realpath(__file__))


def create_app(config='DEBUG'):
    app = Flask(__name__)

    app.config[config] = True

    app.template_folder = os.path.join(PATH, 'templates')

    if not config == 'TESTING':
        create_mongo()

    # views with jinja templates
    app.register_blueprint(bp_index)

    # api resources
    api = Api(app)

    return app
