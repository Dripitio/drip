class Config(object):
    SHOPIFY_API_KEY = 'e90d00400dca5df8133b79166c51a4a5'
    SHOPIFY_API_SECRET = 'eff99d809e13640a2db0bff592b771cd'


class Development(Config):
    DEBUG = True
    TESTING = False
    SECRET_KEY = 'devkey'

    MONGODB_SETTINGS = {
        'db': 'drip',
        'host': '192.168.99.100',
        'port': 27017
    }

    try:
        from drip.local_config import *
    except ImportError:
        pass


class Production(Config):
    DEBUG = True
    TESTING = False
    SECRET_KEY = '1d55c8f69430064fdb822549693361890361ab17'

    MONGODB_SETTINGS = {
        'db': 'drip',
        'host': 'localhost',
        'port': 27017
    }
