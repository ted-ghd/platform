from sqlalchemy import Column, String, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship, backref
from .entity import Entity, Base
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from .container_volume import ContainerVolume, ContainerVolumeSchema

class Container(Base):
    __tablename__ = 'container'
    id = Column(Integer, primary_key=True)
    con_id = Column(Integer)
    dep_id = Column(Integer, ForeignKey('deploy.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)
    
    con_name  = Column(String)
    con_port = Column(String)
    con_args = Column(String)
    con_cmd = Column(String)
    con_vol_name = Column(String)
    con_vol_path  = Column(String)
    con_vol_cnt = Column(Integer)
    con_gpu = Column(String)
    con_exp_port = Column(String)
    con_vols = relationship("ContainerVolume")

    def __init__(self, id, 
                  con_name, 
                con_port ,
                con_args ,
                con_cmd ,
                con_vol_name ,
                con_vol_path  ,
                con_vol_cnt ,
                con_gpu,
                con_exp_port,
                created_by):
        
        self.id = id;
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.last_updated_by = created_by
        
        self.con_name =con_name
        self.con_port =con_port
        self.con_args =con_args
        self.con_cmd =con_cmd
        self.con_vol_name =con_vol_name
        self.con_vol_path =con_vol_path
        self.con_vol_cnt = con_vol_cnt
        self.con_gpu = con_gpu
        self.con_exp_port = con_exp_port

class ContainerSchema(Schema):
    id = fields.Number()
    dep_id = fields.Number()
    con_id = fields.Number()
    con_name  = fields.Str()
    con_port  = fields.Str()
    con_args  = fields.Str()
    con_cmd  = fields.Str()
    con_vol_name  = fields.Str()
    con_vol_path  = fields.Str()
    con_gpu  = fields.Str()
    con_exp_port  = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    con_vol_cnt = fields.Number()
    last_updated_by = fields.Str()
    con_vols = fields.Nested(ContainerVolumeSchema, many=True)