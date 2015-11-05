import bcrypt
from flask.ext.login import unicode
from mongoengine import EmailField, StringField, Document, EmbeddedDocument, EmbeddedDocumentField, \
    BooleanField
from werkzeug.security import safe_str_cmp


class ShopifyIntegration(EmbeddedDocument):
    oauth_token = StringField()
    shop_url = StringField()
    installed = BooleanField(default=False)


class MailChimpIntegration(EmbeddedDocument):
    api_key = StringField()


class User(Document):
    # Customers registration email
    email = EmailField()

    # encoded field
    password_hash = StringField()

    shopify_integration = EmbeddedDocumentField(ShopifyIntegration)
    mailchimp_integration = EmbeddedDocumentField(MailChimpIntegration)

    def get_password(self):
        """
        Password property getter, just return the password hash.
        """
        return self.password_hash

    def set_password(self, value):
        """
        Password property setter, automatically encrypts the password.
        """
        self.password_hash = bcrypt.hashpw(value, bcrypt.gensalt())

    @classmethod
    def from_email(cls, email):
        """
        Get user by email.
        """
        if email:
            return cls.objects(email__iexact=email).first()
        else:
            return None

    password = property(get_password, set_password)

    def is_valid_password(self, password):
        """
        Check if given password is valid.
        """
        return safe_str_cmp(
            bcrypt.hashpw(password.encode('utf-8'), self.password_hash.encode('utf-8')),
            self.password_hash
        )

    def is_authenticated(self):
        """
        Boilerplate for Flask-Login, not really used.
        """
        return True

    def is_active(self):
        """
        Is the user active? Email confirmed? Not suspended?
        """
        # return self.email_confirmed
        return True

    def is_anonymous(self):
        """
        Boilerplate for Flask-Login, not really used.
        """
        return False

    def get_id(self):
        """
        Get unicode representation of user documents id.
        """
        return unicode(self.id)

