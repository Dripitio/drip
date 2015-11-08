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
@dashboard.route('/stats')
def stats():
    mc_templates = []

    mc_api_key = current_user.mailchimp_integration.api_key \
        if current_user.mailchimp_integration else None

    if mc_api_key:
        mc = Mailchimp(apikey=mc_api_key, debug=True)

        mc_templates = mc.templates.list(filters={"include_drag_and_drop": True})

    return render_template('dashboard/stats.html', mc_templates=mc_templates)


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

    return render_template('dashboard/settings.html', mc_form=mc_form)
