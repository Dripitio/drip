import os

from setuptools import setup, find_packages
from setuptools.command.develop import develop

ROOT = os.path.realpath(os.path.join(os.path.dirname(__file__)))

dev_requires = [
    'pytest',
    'tox',
    'ipython==4.0.0',
    'mock==1.3.0',
]

install_requires = [
    'bcrypt==2.0.0',
    'flask==0.10.1',
    'pymongo==3.0.3',
    'Flask-Script==2.0.5',
    'flask-mongoengine==0.7.3',
    'Flask-WTF==0.12',
    'Flask-Login==0.3.2',
    'mailchimp==2.0.9',
    'ShopifyAPI==2.1.5',
    'newrelic==2.56.0.42',
]

backend_install_requires = [
    "BeautifulSoup==3.2.1",
    "blinker==1.4",
    "docopt==0.4.0",
    "mailchimp==2.0.9",
    "mongoengine==0.10.0",
    "pymongo==3.1",
    "requests==2.8.1",
]

class DevelopWithBuildStatic(develop):
    def install_for_development(self):
        return develop.install_for_development(self)


setup(
    name='drip',
    version='1.0.0',
    packages=find_packages(),
    zip_safe=False,
    install_requires=install_requires + backend_install_requires,
    extras_require={
        'dev': dev_requires,
    },
    cmdclass={
        'develop': DevelopWithBuildStatic,
    },
    include_package_data=True
)
