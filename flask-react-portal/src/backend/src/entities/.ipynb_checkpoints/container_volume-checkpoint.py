from sqlalchemy import Column, String, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship, backref
from .entity import Entity, Base
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime

class ContainerVolume(Base):
    __tablename__ = 'container_volume'
    id = Column(Integer, primary_key=True)
    vol_id = Column(Integer)
    con_id = Column(Integer, ForeignKey('container.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)
    
    con_vol_name = Column(String)
    con_vol_path = Column(String)


    def __init__(self, id, 
                  con_vol_name, 
                con_vol_path 
                ,created_by,
                vol_id):
        
        self.id = id;
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.last_updated_by = created_by
        self.vol_id = vol_id
        self.con_vol_name =con_vol_name
        self.con_vol_path =con_vol_path
       

class ContainerVolumeSchema(Schema):
    id = fields.Number()
    vol_id = fields.Number()
    con_id = fields.Number()
    con_vol_name = fields.Str()
    con_vol_path = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()