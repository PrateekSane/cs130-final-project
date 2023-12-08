# Getting Started with the Backend

## Available Scripts

In the project directory, first run:
### `pip3 install -r requirements.txt`
This will look at the requirements.txt file and install all needed dependencies. After that you should be able to run:

### `python3 manage.py makemigrations`
### `python3 manage.py migrate`
This will setup the models for the MongoDB database. Note: Make sure you run the previous command to ensure PyMongo is instålled.

### `python3 manage.py runserver`

Runs the app in the locally in development mode.\
This will open the API server on [http://localhost:8000](http://localhost:8000) which can be requested based on the API documentation

