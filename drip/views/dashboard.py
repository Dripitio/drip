from flask import Blueprint, render_template, request
from flask.ext.login import current_user, login_required
from flask.ext.wtf import Form
from wtforms import StringField

from drip.backend.data_captain import DataCaptain
from drip.backend.mailchimp_wrapper import MailchimpWrapper
from drip.backend.model import List
from drip.db.drip import Campaign
from drip.db.user import MailChimpIntegration

dashboard = Blueprint('dashboard', __name__)


class MailChimpForm(Form):
    api_key = StringField()


notifications_data_views = []


def include_notifications(fn):
    notifications_data_views.append(fn.__name__)
    return fn


@dashboard.context_processor
def additional_context():
    # this code work if endpoint equals to view function name
    if request.endpoint.split('.')[1] not in notifications_data_views:
        return {}

    notifications = []
    if not current_user.mailchimp_integration or not current_user.mailchimp_integration.api_key:
        notifications.append('Please add Mailchimp API Key')
    if not current_user.shopify_integration or not current_user.shopify_integration.installed:
        notifications.append('Please install Shopify app')

    return {'notifications': notifications}


@login_required
@dashboard.route('/drip')
@include_notifications
def drip():
    campaigns = Campaign.objects(user_id=current_user.id).all()
    return render_template('dashboard/drip_list.html', active_nav='index', campaigns=campaigns)


@login_required
@dashboard.route('/drip/create')
@include_notifications
def drip_create():
    mc = MailchimpWrapper(current_user.mailchimp_integration.api_key)
    dc = DataCaptain(current_user.id, mc)

    lists = dc.update_lists()
    templates = dc.update_templates()

    preload = {
        'userLists': lists,
        'templates': templates,
    }
    return render_template('dashboard/drip.html', active_nav='index', preload=preload)


@login_required
@dashboard.route('/settings', methods=['GET', 'POST'])
@include_notifications
def settings():
    return render_template('dashboard/settings.html', active_nav='settings')
