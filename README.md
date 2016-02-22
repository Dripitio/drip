# drip

Advanced drip email campaign scheduler.

Performs automatic email sending based on predefined schedule scheme.

For each batch you define email template and the choice of next email according to recipient's actions (not opened, opened, clicked on link, etc.)

Currently integrates with Mailchimp

## Development setup

Run docker-compose from root directory
```
#!bash
docker-compose up
```

Setup python virtualenv and install packages
```
#!bash
mkvirtualenv drip
pip install -e .
```

Install assets dependencies

```
#!bash
npm install
```

Build static assets

```
#!bash

gulp build
```

Finally run development server

```
#!bash

python manage.py runserver
```

## Deployment

```
#!bash

# if server and services is already bootstrapped
ansible-playbook -i deploy/hosts.ini deploy/site.yml -t deploy

# or this if uwsgi/nginx has been updated or needs to be bootstrapped (should not break anything in any case)
ansible-playbook -i deploy/hosts.ini deploy/site.yml -t app
```
