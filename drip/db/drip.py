import datetime

from mongoengine import Document, DateTimeField
from mongoengine import StringField, ObjectIdField
from mongoengine.base import BaseField


class Campaign(Document):
    user_id = ObjectIdField(required=True)
    name = StringField(required=True)
    created_at = DateTimeField(default=datetime.datetime.now())
    status = BaseField(default='draft', choices=['draft', 'published'])
