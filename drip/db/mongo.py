from pymongo import MongoClient

client = None
db = lambda: client.get_database('hustler')


def create_mongo():
    """
    Mongo connection factory
    :return:
    """
    global client
    client = MongoClient(host='192.168.99.100', port=27017)
