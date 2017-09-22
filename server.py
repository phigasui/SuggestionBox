#! /usr/bin/env python

import json
from bson import json_util
from flask import Flask, Response, request
from flask_pymongo import PyMongo


app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
mongo = PyMongo(app)

HEADERS = {
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
}


@app.route('/api/suggestions', methods=['GET', 'POST'])
def getSuggestions():
    if request.method == 'GET':
        try:
            data = [d for d in mongo.db.suggestions.find()]
            message = 'success'
        except:
            message = 'error'

        return Response(
            json.dumps({'data': data, 'message': message}, default=json_util.default),
            mimetype='application/json',
            headers=HEADERS
        )

    elif request.method == 'POST':
        data = {
            'title': request.form.get('title'),
            'description': request.form.get('desc'),
            'push': 0,
            'opened': True,
        }

        try:
            mongo.db.suggestions.insert_one(data)
            message = 'success'
        except:
            message = 'error'

        return Response(
            json.dumps({'message': message}),
            mimetype='application/json',
            headers=HEADERS
        )


if __name__ == '__main__':
    app.run(debug=True)
