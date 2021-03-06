import unittest

from mock import patch, MagicMock

from drip.app import create_app
from drip.db.user import User
from drip.views.main import LoginForm


class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(testing=True)
        self.app.config['WTF_CSRF_ENABLED'] = False
        self.tc = self.app.test_client()


class IndexTestCase(AppTestCase):
    def test_index(self):
        rv = self.tc.get('/')
        assert rv.status_code == 200


class MockForm(object):
    def validate_on_submit(self):
        return True


class LoginTestCase(AppTestCase):
    @patch('drip.views.main.LoginForm')
    def test_get_login_page(self, mock_login_form):
        # HACK: LoginForm needs app context on init, so create tmp one
        with self.app.test_request_context('/login'):
            login_form = LoginForm()
        login_form.validate_on_submit = MagicMock(return_value=False)
        mock_login_form.return_value = login_form

        rv = self.tc.get('/login')
        assert rv.status_code == 200
        assert login_form.validate_on_submit.called

    @patch('drip.views.main.login_user')
    @patch('drip.views.main.LoginForm')
    @patch.object(User, 'from_email')
    def test_post_valid_login(self, mock_from_email, mock_login_form, mock_login_user):
        email = 'example@example.com'
        password = 'testing'

        # LoginForm needs app context, so we create one for mock init
        with self.app.test_request_context('/login'):
            login_form = LoginForm()
        login_form.validate_on_submit = MagicMock(return_value=True)
        mock_login_form.return_value = login_form

        user = dict(test=True)
        mock_from_email.return_value = user

        rv = self.tc.post('/login', data=dict(
            email=email,
            password=password
        ))

        assert rv.status_code == 302
        assert login_form.validate_on_submit.called
        assert mock_from_email.called
        assert mock_login_user.called

    @patch('drip.views.main.User')
    def test_valid_signup(self, mock_user):
        email = 'example@example.com'
        password = 'testing'
        shop_url = 'example.myshopify.com'

        user = User()
        user.save = MagicMock()
        mock_user.return_value = user

        rv = self.tc.post('/signup?shop=' + shop_url, data=dict(
            email=email,
            password=password,
            password_repeat=password,
        ))

        assert rv.status_code == 302
        assert user.save.called


if __name__ == '__main__':
    unittest.main()
