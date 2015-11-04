from flask import Blueprint, render_template, request, redirect, url_for
from flask.ext.login import current_user, login_user, logout_user
from flask.ext.wtf import Form
from wtforms import PasswordField, StringField, BooleanField

from drip.db.user import User

bp_index = Blueprint('main', __name__)


class LoginForm(Form):
    email = StringField()
    password = PasswordField()
    remember_me = BooleanField('Remember me', default=False)


@bp_index.route('/', methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        return render_template('dashboard/dashboard.html')
    return render_template('landing/landing.html')


@bp_index.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)

    if form.validate_on_submit():
        u = User.from_email(email=form.email.data)
        login_user(u, remember=form.remember_me.data)
        return redirect(request.args.get('next') or url_for('main.index'))

    return render_template('landing/login.html', form=form)


@bp_index.route('/logout', methods=['GET'])
def logout():
    if not current_user.is_anonymous():
        logout_user()
    return redirect(url_for('main.index'))
