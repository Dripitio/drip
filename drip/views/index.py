from flask import Blueprint, render_template, request, redirect, url_for
from flask.ext.login import current_user, login_user, logout_user
from flask.ext.wtf import Form
from wtforms import PasswordField, StringField, BooleanField, ValidationError
from wtforms.validators import DataRequired, EqualTo

from drip.db.user import User

bp_index = Blueprint('main', __name__)


class LoginForm(Form):
    email = StringField()
    password = PasswordField('Password', [DataRequired()])
    remember_me = BooleanField('Remember me', default=False)

    def validate_email(self, field):
        email = field.data
        user = User.from_email(email)
        if not user:
            raise ValidationError('Invalid email.')

    def validate_password(self, field):
        email = self.email.data
        user = User.from_email(email)
        if user and not user.is_valid_password(field.data):
            raise ValidationError('Invalid password.')


class SignupForm(Form):
    email = StringField()
    # TODO: validate repeated password
    password = PasswordField('Password', [DataRequired(), EqualTo('password_repeat',
                                                                  'Password must match')])
    password_repeat = PasswordField('Repeat password')


@bp_index.route('/', methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.stats'))
    return render_template('landing/landing.html')


@bp_index.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)

    if form.validate_on_submit():
        u = User.from_email(email=form.email.data)
        if u:
            login_user(u, remember=form.remember_me.data)
            return redirect(request.args.get('next') or url_for('main.index'))

    return render_template('landing/login.html', form=form)


@bp_index.route('/logout', methods=['GET'])
def logout():
    if not current_user.is_anonymous():
        logout_user()
    return redirect(url_for('main.index'))


@bp_index.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm(request.form)
    if form.validate_on_submit():
        # create user
        user = User()
        user.set_password(form.password.data.encode('utf-8'))
        user.email = form.email.data
        user.save()

        return redirect(url_for('main.login', next=request.args.get('next')))

    return render_template('landing/signup.html', form=form, next=request.args.get('next'))
