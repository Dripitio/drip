import unittest

from drip.app import create_app


class AppTestCase(unittest.TestCase):
    def setUp(self):
        app = create_app(env='TESTING')
        self.tc = app.test_client()


class IndexTestCase(AppTestCase):
    def test_index(self):
        rv = self.tc.get('/')
        assert rv.status_code == 200


if __name__ == '__main__':
    unittest.main()
