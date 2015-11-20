from mongoengine import Document
from mongoengine import StringField, ObjectIdField


class Campaign(Document):
    user_id = ObjectIdField(required=True)
    name = StringField(required=True)
