from sqlalchemy import Column, String, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship, backref
from .entity import Entity, Base
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime

class Volume(Base):
    __tablename__ = 'volume'
    id = Column(Integer, primary_key=True)
    vol_id = Column(Integer)
    dep_id = Column(Integer, ForeignKey('deploy.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)
    
    vol_name = Column(String)
    vol_size = Column(String)

    #con_name  = Column(String)
    #con_port = Column(String)
    #con_args = Column(String)
    #con_cmd = Column(String)
    #con_vol_name = Column(String)
    #con_vol_path  = Column(String)


    def __init__(self, id, 
                  vol_name, 
                vol_size 
                ,created_by):
        
        self.id = id;
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.last_updated_by = created_by
        
        self.vol_name =vol_name
        self.vol_size =vol_size
       

class VolumeSchema(Schema):
    id = fields.Number()
    dep_id = fields.Number()
    vol_id = fields.Number()
    con_id = fields.Number()
    vol_name = fields.Str()
    vol_size = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()