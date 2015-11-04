import json
import unittest
from unittest.mock import patch

from drip.app import create_app


class APITestCase(unittest.TestCase):
    def setUp(self):
        app = create_app(config='TESTING')
        self.tc = app.test_client()

    def json(self, resp):
        """
        Decode Response object json data to dict
        :param resp: Response object
        :return: dict
        """
        return json.loads(resp.data.decode('utf-8'))

    def tearDown(self):
        print('Test teardown')


class IndexTestCase(APITestCase):
    def test_index(self):
        rv = self.tc.get('/')
        assert rv.status_code == 200

if __name__ == '__main__':
    unittest.main()
