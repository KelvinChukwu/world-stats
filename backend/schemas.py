from flask_marshmallow import Marshmallow
from marshmallow import fields
from marshmallow_sqlalchemy import auto_field

from models import City, Country, CountryLanguage, Continent

ma = Marshmallow()


class CountrySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Country

    capital = fields.Nested("CitySchema")
    languages = fields.Nested("CountryLanguageSchema", many=True)


class CountryQueryArgsSchema(ma.Schema):
    name_contains = fields.Str(allow_none=True)
    continent = fields.Enum(
        Continent, allow_none=True
    )  # TODO: make this a multi-select, if possible
    population_min = fields.Int(allow_none=True)
    population_max = fields.Int(allow_none=True)
    life_expectancy_min = fields.Float(allow_none=True)
    life_expectancy_max = fields.Float(allow_none=True)
    surface_area_min = fields.Float(allow_none=True)
    surface_area_max = fields.Float(allow_none=True)


class CountryUpdateArgsSchema(ma.Schema):
    population = fields.Int(allow_none=True)
    life_expectancy = fields.Float(allow_none=True)
    head_of_state = fields.Str(allow_none=True)
    government_form = fields.Str(allow_none=True)


class LoginArgsSchema(ma.Schema):
    email = fields.Email()
    password = fields.Str()


class CitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = City
        include_fk = True

    country_name = auto_field()


class CityUpdateArgsSchema(ma.Schema):
    population = fields.Int()


class CountryLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CountryLanguage
        include_fk = True
