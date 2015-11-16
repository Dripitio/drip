from mongoengine import Document, IntField, StringField, BooleanField, ListField, \
    ObjectIdField, DateTimeField, EmbeddedDocument, EmbeddedDocumentField, signals
from datetime import datetime


class List(Document):
    shop_url = StringField()
    name = StringField()
    list_id = StringField()
    active = BooleanField()
    members_euid = ListField(StringField())

    created_at = DateTimeField()
    updated_at = DateTimeField()


class Template(Document):
    shop_url = StringField()
    name = StringField()
    template_id = IntField()
    source = StringField()
    links = ListField(StringField())
    active = BooleanField()

    created_at = DateTimeField()
    updated_at = DateTimeField()

class DripCampaign(Document):
    shop_url = StringField()
    name = StringField()
    description = StringField()
    list_id = StringField()
    active = BooleanField()

    created_at = DateTimeField()
    updated_at = DateTimeField()


class Content(EmbeddedDocument):
    template_id = IntField()
    subject = StringField()
    from_email = StringField()
    from_name = StringField()


class Node(Document):
    drip_campaign_id = ObjectIdField()
    title = StringField()
    description = StringField()
    done = BooleanField()
    start_time = DateTimeField()
    content = EmbeddedDocumentField(Content)
    initial = BooleanField()
    segment_oid = ObjectIdField()
    campaign_id = StringField()

    created_at = DateTimeField()
    updated_at = DateTimeField()


class Trigger(Document):
    drip_campaign_id = ObjectIdField()
    node_from = ObjectIdField()
    node_to = ObjectIdField()
    opened = BooleanField()
    clicked = StringField()
    default = BooleanField()

    created_at = DateTimeField()
    updated_at = DateTimeField()


class Member(Document):
    email = StringField()
    member_id = StringField()

    created_at = DateTimeField()
    updated_at = DateTimeField()


class Segment(Document):
    segment_id = IntField()
    name = StringField()
    members_euid = ListField(StringField())

    created_at = DateTimeField()
    updated_at = DateTimeField()


# set presave signal to always set creation time on first save
def set_create_time(sender, document, **kwargs):
    now = datetime.utcnow()
    document.created_at = now
    document.updated_at = now
signals.pre_save.connect(set_create_time)
