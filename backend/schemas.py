from flask_marshmallow import Marshmallow
from marshmallow import fields

from models import City, Country, CountryLanguage

ma = Marshmallow()

class CountrySchema(ma.SQLAlchemyAutoSchema):
     capital = fields.Nested("CitySchema")
     class Meta:
          model = Country
    
    

class CitySchema(ma.SQLAlchemyAutoSchema):
     class Meta:
          model = City

class CountryLanguageSchema(ma.SQLAlchemyAutoSchema):
     class Meta:
          model = CountryLanguage