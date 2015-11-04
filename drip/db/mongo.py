from flask.ext.mongoengine import MongoEngine

client = MongoEngine()


def create_mongo(app):
    """
    Mongo connection factory
    """
    global client

    # get db client
    client.init_app(app)
