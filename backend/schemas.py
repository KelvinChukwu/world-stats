from flask_marshmallow import Marshmallow

from models import Country

ma = Marshmallow()

class CountrySchema(ma.SQLAlchemyAutoSchema):
     class Meta:
          model = Country