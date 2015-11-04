class Config(object):
    SHOPIFY_API_KEY = 'e90d00400dca5df8133b79166c51a4a5'
    SHOPIFY_API_SECRET = 'eff99d809e13640a2db0bff592b771cd'

    DEBUG = True
    TESTING = False
    SECRET_KEY = 'devkey'

    MONGODB_SETTINGS = {
        'db': 'drip',
        'host': '192.168.99.100',
        'port': 27017
    }
