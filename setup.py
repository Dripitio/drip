import os

from setuptools import setup, find_packages
from setuptools.command.develop import develop

ROOT = os.path.realpath(os.path.join(os.path.dirname(__file__)))

dev_requires = [
    'flake8',
    'pytest',
    'tox',
]

install_requires = [
    'flask==0.10.1',
    'pymongo==3.0.3',
    'Flask-Script==2.0.5',
]


class DevelopWithBuildStatic(develop):
    def install_for_development(self):
        return develop.install_for_development(self)


setup(
    name='drip',
    version='1.0.0',
    packages=find_packages(),
    zip_safe=False,
    install_requires=install_requires,
    extras_require={
        'dev': dev_requires,
    },
    cmdclass={
        'develop': DevelopWithBuildStatic,
    },
    include_package_data=True
)
