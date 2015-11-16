# drip

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