from flask import Flask
from flask.views import MethodView
from flask_mysqldb import MySQL
from dotenv import dotenv_values
from flask_smorest import Api, Blueprint, abort, Page
from sqlalchemy import select
from models import db, City, Country, Continent
from schemas import CitySchema, CountryQueryArgsSchema, ma, CountrySchema, CityUpdateArgsSchema, CountryUpdateArgsSchema


secrets = dotenv_values(".env")


app = Flask(__name__)

class APIConfig:
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    DATABASE_URI = secrets["DATABASE_URI"]
    MYSQL_PASSWORD = secrets["MYSQL_PASSWORD"]
    MYSQL_DB = 'world'
    MYSQL_CURSORCLASS = 'DictCursor'
    API_TITLE = 'WORLD STATS API'
    API_VERSION = 'v1'
    OPENAPI_VERSION = '3.1.0'
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = '/docs'
    OPENAPI_SWAGGER_UI_URL = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'
    SQLALCHEMY_DATABASE_URI = f"{DATABASE_URI}"
    SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_recycle': 295
    }
    

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
    @countries_blp.arguments(CountryQueryArgsSchema, location="query")
    @countries_blp.response(200,countries_schema)
    @countries_blp.paginate()
    def get (self, queryArgs, pagination_parameters:Page):
        """List countries"""
        search_query = select(Country).order_by(Country.name)
        if "name_contains" in queryArgs:
            search_query = search_query.where(Country.name.icontains(queryArgs.get("name_contains")))
        if  "continent" in queryArgs:
            search_query = search_query.where(Country.continent == queryArgs.get("continent").value)
        if "population_min" in queryArgs:
            search_query = search_query.where(Country.population >= queryArgs.get("population_min"))
        if "population_max" in queryArgs:
            search_query = search_query.where(Country.population <= queryArgs.get("population_max"))
        if "life_expectancy_min" in queryArgs:
            search_query = search_query.where(Country.life_expectancy >= queryArgs.get("life_expectancy_min"))
        if "life_expectancy_max" in queryArgs:
            search_query = search_query.where(Country.life_expectancy <= queryArgs.get("life_expectancy_max"))
        if "surface_area_min" in queryArgs:
            search_query = search_query.where(Country.surface_area >= queryArgs.get("surface_area_min"))
        if  "surface_area_max" in queryArgs:
            search_query = search_query.where(Country.surface_area <= queryArgs.get("surface_area_max"))
        countries_pagination = db.paginate(search_query,page=pagination_parameters.page, per_page=pagination_parameters.page_size)
        pagination_parameters.item_count = countries_pagination.total
        return countries_pagination.items
     
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
    
    @cities_blp.arguments(CountryUpdateArgsSchema)
    @cities_blp.response(200,country_schema)
    def patch(self, update_data, country_code):
        """Update existing country"""
        country = db.session.execute(select(Country).filter_by(code = country_code)).scalar()
        if country:
            if "population" in update_data and update_data["population"]:
                country.population = update_data["population"]
            if "life_expectancy" in update_data and update_data["life_expectancy"]:
                country.life_expectancy = update_data["life_expectancy"]
            if "head_of_state" in update_data and  update_data["head_of_state"]:
                country.head_of_state = update_data["head_of_state"]
            if "government_form" in update_data and update_data["government_form"]:
                country.government_form = update_data["government_form"]
            db.session.commit()
        else:
            abort(404,message ="Country not found")
               
@cities_blp.route("/")
class Cities(MethodView):
    @cities_blp.response(200,cities_schema)
    @cities_blp.paginate()
    def get (self, pagination_parameters):
        """List cities"""
        cities_pagination = db.paginate(select(City).order_by(City.name),page=pagination_parameters.page, per_page=pagination_parameters.page_size)
        pagination_parameters.item_count = cities_pagination.total
        print(pagination_parameters)
        return cities_pagination.items

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
    
    @cities_blp.arguments(CityUpdateArgsSchema)
    @cities_blp.response(200,city_schema)
    def patch(self, update_data, id: int):
        """Update existing city"""
        city = db.session.execute(select(City).filter_by(id = id)).scalar()
        if city:
            city.population = update_data["population"]
            db.session.commit()
        else:
            abort(404,message ="City not found")
    


api.register_blueprint(countries_blp)
api.register_blueprint(cities_blp)

# Run
if __name__ == '__main__':
    app.run(debug=True)



