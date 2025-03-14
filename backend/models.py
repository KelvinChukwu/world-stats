import enum

from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, Enum
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.associationproxy import AssociationProxy

db = SQLAlchemy()

class Continent (enum.Enum):
    ASIA = 'Asia'
    EUROPE = 'Europe'
    NORTH_AMERICA = 'North America'
    AFRICA = 'Africa'
    OCEANIA = 'Oceania'
    ANTARCTICA = 'Antarctica'
    SOUTH_AMERICA = 'South America'

class IsOfficialLanguage (enum.Enum):
    T = 'T'
    F = 'F'

class Country(db.Model):
    code: Mapped[str] = mapped_column(primary_key=True, type_= String(3))
    code2: Mapped[str] = mapped_column(String(2))
    capital_id: Mapped[int] = mapped_column(ForeignKey("city.id"),name="capital")
    capital: Mapped["City"] = relationship( primaryjoin="Country.capital_id == City.id")
    languages: Mapped[List["CountryLanguage"]] = relationship(primaryjoin="Country.code == CountryLanguage.country_code")
    name: Mapped[str] = mapped_column(unique=True)
    continent: Mapped[Continent] = mapped_column(Enum('Asia','Europe', 'North America', 'Africa','Oceania','Antarctica','South America', name="country_continent"))
    region: Mapped[str]
    surface_area: Mapped[float]
    indep_year: Mapped[int]
    population: Mapped[int]
    life_expectancy: Mapped[float]
    gnp: Mapped[float]
    local_name: Mapped[str]
    government_form: Mapped[str]
    head_of_state: Mapped[str]

class City (db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    country_code: Mapped[str] = mapped_column(ForeignKey(Country.code))
    country: Mapped[Country] = relationship(primaryjoin="City.country_code == Country.code")
    country_name: AssociationProxy[str] = association_proxy("country", "name")
    district: Mapped[str]
    population: Mapped[int]

class CountryLanguage (db.Model):
    #__tablename__ = "country_language"
    language: Mapped[str] = mapped_column(primary_key=True)
    country_code: Mapped[str] = mapped_column(ForeignKey(Country.code), primary_key=True)
    is_official: Mapped[IsOfficialLanguage] = mapped_column(Enum('T','F', name="country_language_is_official"))
    percentage: Mapped[float]


