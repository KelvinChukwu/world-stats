from flask_marshmallow import Marshmallow
from marshmallow import fields

from models import City, Country, CountryLanguage

ma = Marshmallow()

class CountrySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Country
    capital = fields.Nested("CitySchema")
    languages = fields.Nested("CountryLanguageSchema", many=True)

class CountryUpdateArgsSchema (ma.Schema):
    population = fields.Int(allow_none=True)
    life_expectancy = fields.Float(allow_none=True)
    head_of_state = fields.Str(allow_none=True)
    government_form = fields.Str(allow_none=True)
    
class CitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = City
        include_fk = True

class CityUpdateArgsSchema (ma.Schema):
    population = fields.Int()

class CountryLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CountryLanguage
        include_fk = True