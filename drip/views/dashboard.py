from flask import Blueprint, render_template, request
from flask.ext.login import current_user
from flask.ext.wtf import Form
from mailchimp import Mailchimp
from wtforms import StringField

from drip.db.user import MailChimpIntegration

dashboard = Blueprint('dashboard', __name__)


class MailChimpForm(Form):
    api_key = StringField()


@dashboard.route('/stats')
def stats():
    mc_templates = []

    mc_api_key = current_user.mailchimp_integration.api_key \
        if current_user.mailchimp_integration else None

    if mc_api_key:
        mc = Mailchimp(apikey=mc_api_key, debug=True)

        mc_templates = mc.templates.list(filters={"include_drag_and_drop": True})

    return render_template('dashboard/stats.html', mc_templates=mc_templates)


@dashboard.route('/settings', methods=['GET', 'POST'])
def settings():
    form = MailChimpForm(request.form)

    if form.validate_on_submit():
        current_user.mailchimp_integration = MailChimpIntegration()
        current_user.mailchimp_integration.api_key = form.api_key.data
        current_user.save()

    if current_user.mailchimp_integration:
        form.api_key.data = current_user.mailchimp_integration.api_key

    return render_template('dashboard/settings.html', form=form)
