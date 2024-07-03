from flask import Flask, jsonify, make_response
from flask.views import MethodView
from flask_mysqldb import MySQL
from dotenv import dotenv_values
from flask_smorest import Api, Blueprint, abort
from sqlalchemy import select
from models import db, City, Country, CountryLanguage
from schemas import CitySchema, CountryLanguageSchema, ma, CountrySchema


secrets = dotenv_values(".env")


app = Flask(__name__)

class APIConfig:
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = secrets["MYSQL_PASSWORD"]
    MYSQL_DB = 'world'
    MYSQL_CURSORCLASS = 'DictCursor'
    API_TITLE = 'WORLD STATS API'
    API_VERSION = 'v1'
    OPENAPI_VERSION = '3.1.0'
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = '/docs'
    OPENAPI_SWAGGER_UI_URL = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'
    SQLALCHEMY_DATABASE_URI = f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
    

app.config.from_object(APIConfig)
mysql = MySQL(app)
api = Api(app)

db.init_app(app)
ma.init_app(app)

countries_blp = Blueprint("countries", "countries",url_prefix = "/countries", description = "Operations on countries")

countries_schema = CountrySchema(many=True)
country_schema = CountrySchema()

city_schema = CitySchema()
cities_schema = CitySchema(many=True)

country_language_schema = CountryLanguageSchema()
country_languages_schema = CountryLanguageSchema(many = True)

# Routes
@app.route('/')
def hello_world():
    return 'Hello, World!'

@countries_blp.route("/")
class Countries(MethodView):
     @countries_blp.response(200,countries_schema)
     def get (self):
          """List countries"""
          return db.session.execute(db.select(Country).order_by(Country.name)).scalars().all()

api.register_blueprint(countries_blp)

""" @app.route('/countries', methods=['GET'])
def get_countries():
        all_countries = db.session.execute(db.select(Country).order_by(Country.name)).scalars().all()
        return countries_schema.dump(all_countries) """
 

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



