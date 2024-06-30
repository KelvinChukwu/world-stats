from flask import Flask, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'practice'
app.config['MYSQL_DB'] = 'world'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

# Routes
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/countries', methods=['GET'])
def get_countries():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM country''')
    data = cur.fetchall()
    cur.close()
    return jsonify(data)

@app.route('/cities', methods=['GET'])
def get_city_data():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM city''')
    data = cur.fetchall()
    cur.close()
    return jsonify(data)

@app.route('/country/<string:code>', methods=['GET'])
def get_country_data_by_code(code):
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM country WHERE code = %s''', (code,))
    data = cur.fetchall()
    cur.close()
    return jsonify(data)

@app.route('/city/<int:id>', methods=['GET'])
def get_city_data_by_id(id):
    cur = mysql.connection.cursor()
    cur.execute('''SELECT country.name as country, city.name, city.population, city.district, city.id, city.countrycode 
                FROM city join country on city.CountryCode = country.code 
                WHERE city.ID = %s''', 
                (id,))
    data = cur.fetchall()
    cur.close()
    return jsonify(data)

# Run
if __name__ == '__main__':
    app.run(debug=True)



