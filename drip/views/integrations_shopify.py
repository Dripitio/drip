import shopify as shopify_api
from flask import Blueprint, request, url_for, current_app, redirect
from flask.ext.login import current_user
from werkzeug.urls import url_join

from drip.db.user import ShopifyIntegration

shopify = Blueprint('shopify', __name__)


def get_permission_url(shop_url, api_key, secret):
    """
    Get Shopify permission url.
    """
    scope = ["read_content", "read_products", "read_customers", "read_orders", "write_script_tags",
             "read_fulfillments", "read_shipping"]
    redirect_url = url_for('shopify.finalize', _external=True)

    shopify_api.Session.setup(api_key=api_key, secret=secret)
    shopify_api_session = shopify_api.Session(shop_url)
    permission_url = shopify_api_session.create_permission_url(scope, redirect_uri=redirect_url)

    return permission_url


@shopify.route('/integrations/shopify')
def initiate():
    """
    1. step
    Initiate app installation
    """
    args = request.args

    # get shop url from args
    shop_url = args.get('shop')
    # TODO: validate HMAC, so we know that request really is from shopify

    if not current_user.is_authenticated:
        return redirect(url_for('main.signup', next=url_join(request.host_url,
                                                             url_for('shopify.initiate',
                                                                     shop=shop_url))))

    api_key = current_app.config['SHOPIFY_API_KEY']
    secret = current_app.config['SHOPIFY_API_SECRET']
    url = get_permission_url(shop_url, api_key, secret)
    return redirect(url)


@shopify.route('/integrations/shopify/finalize')
def finalize():
    """
    3. step
    Finalize app install
    """
    param_dict = dict(request.args.items())
    api_key = current_app.config['SHOPIFY_API_KEY']
    secret = current_app.config['SHOPIFY_API_SECRET']
    shop_url = request.args['shop']

    # user should be authenticated
    if not current_user.is_authenticated:
        return redirect(url_for('main.signup', next=url_for('shopify.finalize', **param_dict)))

    shopify_api.Session.setup(api_key=api_key, secret=secret)
    shopify_api_session = shopify_api.Session(shop_url)

    shopify_api_session.request_token(param_dict)

    # check if shopify integration is already registered for given user
    current_user.shopify_integration = ShopifyIntegration()
    current_user.shopify_integration.token = shopify_api_session.token
    current_user.shopify_integration.installed = True
    current_user.save()

    return redirect(url_for('main.index'))
