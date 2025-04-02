import enum

from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, Enum
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.associationproxy import AssociationProxy
import graphene
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from graphene_sqlalchemy.types import ORMField

db = SQLAlchemy()
db.Model.query = db.session.query_property()

class Continent (enum.Enum):
    ASIA = 'Asia'
    EUROPE = 'Europe'
    NORTH_AMERICA = 'North_America'
    AFRICA = 'Africa'
    OCEANIA = 'Oceania'
    ANTARCTICA = 'Antarctica'
    SOUTH_AMERICA = 'South_America'

class IsOfficialLanguage (enum.Enum):
    T = 'T'
    F = 'F'

class CountryModel(db.Model):
    __tablename__ = "country"
    code: Mapped[str] = mapped_column(primary_key=True, type_= String(3))
    code2: Mapped[str] = mapped_column(String(2))
    capital_id: Mapped[int] = mapped_column(ForeignKey("city.id"),name="capital")
    capital: Mapped["CityModel"] = relationship( primaryjoin="CountryModel.capital_id == CityModel.id")
    languages: Mapped[List["CountryLanguageModel"]] = relationship(primaryjoin="CountryModel.code == CountryLanguageModel.country_code")
    name: Mapped[str] = mapped_column(unique=True)
    continent: Mapped[str] #= mapped_column(Enum('Asia','Europe', 'North_America', 'Africa','Oceania','Antarctica','South_America', name="country_continent"))
    region: Mapped[str]
    surface_area: Mapped[float]
    indep_year: Mapped[int]
    population: Mapped[int]
    life_expectancy: Mapped[float]
    gnp: Mapped[float]
    local_name: Mapped[str]
    government_form: Mapped[str]
    head_of_state: Mapped[str]

class CityModel (db.Model):
    __tablename__ = "city"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    country_code: Mapped[str] = mapped_column(ForeignKey(CountryModel.code))
    country: Mapped[CountryModel] = relationship(primaryjoin="CityModel.country_code == CountryModel.code")
    country_name: AssociationProxy[str] = association_proxy("country", "name")
    district: Mapped[str]
    population: Mapped[int]

class CountryLanguageModel (db.Model):
    __tablename__ = "country_language"
    language: Mapped[str] = mapped_column(primary_key=True)
    country_code: Mapped[str] = mapped_column(ForeignKey(CountryModel.code), primary_key=True)
    is_official: Mapped[IsOfficialLanguage] = mapped_column(Enum('T','F', name="country_language_is_official"))
    percentage: Mapped[float]


class Country(SQLAlchemyObjectType):
    class Meta:
        model = CountryModel
        interfaces = (graphene.relay.Node,)
        # use `only_fields` to only expose specific fields ie "name"
        # only_fields = ("name",)
        # use `exclude_fields` to exclude specific fields ie "last_name"
        # exclude_fields = ("last_name",)

class City(SQLAlchemyObjectType):
    class Meta:
        model = CityModel
        interfaces = (graphene.relay.Node,)
        # use `only_fields` to only expose specific fields ie "name"
        # only_fields = ("name",)
        # use `exclude_fields` to exclude specific fields ie "last_name"
        # exclude_fields = ("last_name",)

class CountryLanguage(SQLAlchemyObjectType):
    class Meta:
        model = CountryLanguageModel
        interfaces = (graphene.relay.Node,)
        # use `only_fields` to only expose specific fields ie "name"
        # only_fields = ("name",)
        # use `exclude_fields` to exclude specific fields ie "last_name"
        # exclude_fields = ("last_name",)
  

class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    countries = SQLAlchemyConnectionField(Country.connection)
    # cities  = graphene.List(City)

    def resolve_countries(parent, info, **kwargs):
        query = Country.get_query(info)
        if kwargs.get("filter"):
            filter = kwargs.get("filter")
            print(filter)
            if "name" in filter:
                name_filter = filter["name"]
                print(name_filter)
                if "eq" in name_filter:
                    print (name_filter["eq"])
                    query = query.where(CountryModel.name == name_filter["eq"])


        return query.all()

schema = graphene.Schema(query=Query)





