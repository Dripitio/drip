from flask import Blueprint, render_template, request

bp_index = Blueprint('main', __name__)


@bp_index.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@bp_index.route('/login', methods=['POST'])
def login():
    pass
