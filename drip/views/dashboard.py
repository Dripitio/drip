from flask import Blueprint, render_template, request
from flask.ext.login import current_user, login_required
from flask.ext.wtf import Form
from mailchimp import Mailchimp
from wtforms import StringField

from drip.db.user import MailChimpIntegration

dashboard = Blueprint('dashboard', __name__)


class MailChimpForm(Form):
    api_key = StringField()


@login_required
@dashboard.route('/drip')
def drip():
    return render_template('dashboard/drip.html', active_nav='index')


@login_required
@dashboard.route('/settings', methods=['GET', 'POST'])
def settings():
    mc_form = MailChimpForm(request.form)

    if mc_form.validate_on_submit():
        current_user.mailchimp_integration = MailChimpIntegration()
        current_user.mailchimp_integration.api_key = mc_form.api_key.data
        current_user.save()

    # prefill mailchimp form
    if current_user.mailchimp_integration:
        mc_form.api_key.data = current_user.mailchimp_integration.api_key

    return render_template('dashboard/settings.html', active_nav='settings', mc_form=mc_form)
