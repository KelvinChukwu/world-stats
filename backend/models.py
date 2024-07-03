import enum

from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, Enum

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
    continent: Mapped[Continent] = mapped_column(Enum('Asia','Europe', 'North America', 'Africa','Oceania','Antarctica','South America', name="continent_enum"))
    region: Mapped[str]
    surface_area: Mapped[float] = mapped_column(name="SurfaceArea")
    indep_year: Mapped[int] = mapped_column(name="IndepYear")
    population: Mapped[int]
    life_expectancy: Mapped[float] = mapped_column(name="LifeExpectancy")
    gnp: Mapped[float]
    local_name: Mapped[str] = mapped_column(name="LocalName")
    government_form: Mapped[str] = mapped_column(name="GovernmentForm")
    head_of_state: Mapped[str] = mapped_column(name="HeadOfState")

class City (db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    country_code: Mapped[str] = mapped_column(ForeignKey(Country.code), name="CountryCode")
    district: Mapped[str]
    population: Mapped[int]

class CountryLanguage (db.Model):
    __tablename__ = "countrylanguage"
    language: Mapped[str] = mapped_column(primary_key=True)
    country_code: Mapped[str] = mapped_column(ForeignKey(Country.code), primary_key=True, name="CountryCode")
    is_official: Mapped[IsOfficialLanguage] = mapped_column(Enum('T','F', name="is_official_language_enum"),name="IsOfficial")
    percentage: Mapped[float]


