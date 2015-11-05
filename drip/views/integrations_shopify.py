import shopify as shopify_api
from flask import Blueprint, request, url_for, current_app, redirect
from flask.ext.login import login_user, current_user

from drip.db.user import User, ShopifyIntegration

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

    if not shop_url:
        redirect(url_for('main.index'))

    user = User.objects(__raw__={
        'shopify_integration.shop_url': shop_url
    }).first()
    # if there is no integration redirect user to signup page
    if not user or not user.shopify_integration or not user.shopify_integration.installed:
        return redirect(url_for('main.signup', integrations='shopify', shop=shop_url))

    return redirect(url_for('shopify.access', shop=shop_url))


@shopify.route('/integrations/shopify/access')
def access():
    """
    2. step
    Redirect to shopify permission page
    """
    shop_url = request.args.get('shop')

    # user should be authenticated
    if not current_user.is_authenticated:
        return redirect(url_for('main.signup', integrations='shopify', shop=shop_url))

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
        return redirect(url_for('main.signup', integrations='shopify', shop=shop_url))

    shopify_api.Session.setup(api_key=api_key, secret=secret)
    shopify_api_session = shopify_api.Session(shop_url)

    shopify_api_session.request_token(param_dict)

    user = User.objects(__raw__={'shopify_integration.shop_url': shop_url}).first()
    # check if shop is already registered for given user
    if not user:
        user.shopify_integration = ShopifyIntegration()
        user.shopify_integration.token = shopify_api_session.token
        user.shopify_integration.installed = True
        user.save()
    return redirect(url_for('main.index'))
