import unittest

from mock import patch, MagicMock

from drip.app import create_app
from drip.db.user import User
from drip.views.index import LoginForm


class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(env='TESTING')
        self.tc = self.app.test_client()


class IndexTestCase(AppTestCase):
    def test_index(self):
        rv = self.tc.get('/')
        assert rv.status_code == 200


class MockForm():
    def validate_on_submit(self):
        return True


class LoginTestCase(AppTestCase):

    @patch('drip.views.index.LoginForm')
    def test_get_login_page(self, mock_login_form):
        # HACK: LoginForm needs app context on init, so create tmp one
        with self.app.test_request_context('/login'):
            login_form = LoginForm()
        login_form.validate_on_submit = MagicMock(return_value=False)
        mock_login_form.return_value = login_form

        rv = self.tc.get('/login')
        assert rv.status_code == 200
        assert login_form.validate_on_submit.called

    @patch('drip.views.index.login_user')
    @patch('drip.views.index.LoginForm')
    @patch.object(User, 'from_email')
    def test_post_valid_login(self, mock_from_email, mock_login_form, mock_login_user):
        email = 'example@example.com'
        password = 'testing'

        # HACK: LoginForm needs app context on init, so create tmp one
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


if __name__ == '__main__':
    unittest.main()
