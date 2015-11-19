from flask.ext.script import Manager

from drip.app import create_app

app = create_app(env='DEVELOPMENT')
app.debug = True
manager = Manager(app)

if __name__ == "__main__":
    manager.run()
