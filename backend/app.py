from flask import Flask
from flask.views import MethodView
from flask_mysqldb import MySQL
from dotenv import dotenv_values
from flask_smorest import Api, Blueprint, abort
from sqlalchemy import select
from models import db, City, Country
from schemas import CitySchema, ma, CountrySchema


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
cities_blp = Blueprint("cities", "cities",url_prefix = "/cities", description = "Operations on cities")

countries_schema = CountrySchema(many=True)
country_schema = CountrySchema()

city_schema = CitySchema()
cities_schema = CitySchema(many=True)

# Routes
@app.route('/')
def hello_world():
    return 'Hello, World!'

@countries_blp.route("/")
class Countries(MethodView):
     @countries_blp.response(200,countries_schema)
     def get (self):
          """List countries"""
          return db.session.execute(select(Country).order_by(Country.name)).scalars().all()
     
@countries_blp.route("/<country_code>")
class CountriesByCode(MethodView):
     @countries_blp.response(200,country_schema)
     def get (self, country_code: str):
          """Return Country based on code"""
          country = db.session.execute(select(Country).filter_by(code = country_code)).scalar()
          if country:
               return country
          else:
               abort(404,message ="Country not found")
               

@cities_blp.route("/")
class Cities(MethodView):
     @cities_blp.response(200,cities_schema)
     def get (self):
          """List cities"""
          return db.session.execute(select(City).order_by(City.name)).scalars().all()

@cities_blp.route("/<id>")
class CitiesByCode(MethodView):
     @cities_blp.response(200,city_schema)
     def get (self, id: int):
          """Return city based on code"""
          city = db.session.execute(select(City).filter_by(id = id)).scalar()
          if city:
               return city
          else:
               abort(404,message ="City not found")

api.register_blueprint(countries_blp)
api.register_blueprint(cities_blp)

# Run
if __name__ == '__main__':
    app.run(debug=True)



