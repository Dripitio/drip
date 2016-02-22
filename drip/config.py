class Config(object):
    pass


class Development(Config):
    DEBUG = True
    TESTING = False
    SECRET_KEY = 'devkey'

    MONGODB_SETTINGS = {
        'db': 'drip',
        'host': '192.168.99.100',
        'port': 27017
    }

    LOG_SETTINGS = {
        "log_dir": "/var/log/drip",
        "log_name": "drip",
    }

    try:
        from drip.local_config import *
    except ImportError:
        pass


class Production(Config):
    DEBUG = False
    TESTING = False
    SECRET_KEY = '1d55c8f69430064fdb822549693361890361ab17'

    MONGODB_SETTINGS = {
        'db': 'drip',
        'host': 'localhost',
        'port': 27017
    }

    LOG_SETTINGS = {
        "log_dir": "/var/log/drip",
        "log_name": "drip",
    }
