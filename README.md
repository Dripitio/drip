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

gulp
```

Finally run development server

```
#!bash

python manage.py runserver
```
