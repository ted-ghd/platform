from sqlalchemy import Column, String
from datetime import datetime
from .entity import Entity, Base
from .container import Container, ContainerSchema
from .volume import Volume, VolumeSchema
from sqlalchemy.orm import relationship, backref
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime

class Deploy(Base):
    __tablename__ = 'deploy'
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)
    enable_cd = Column(String)

    group = Column(String)
    project = Column(String)
    
    vol_cnt = Column(Integer)
    pod_name = Column(String)
    pod_label = Column(String)
    vol_name = Column(String)
    vol_size = Column(String)
    sc_name = Column(String)
    target_node = Column(String)
    con_cnt = Column(Integer)
    tag = Column(String)
    sub_prj = Column(String) 
    shm_size = Column(String)
    containers = relationship("Container")
    volumes = relationship("Volume")
    mul_dep = Column(String)
    
    def __init__(self, id,  enable_cd , 
        group, project , pod_name, pod_label, vol_name, vol_size, sc_name,
        target_node, con_cnt , vol_cnt, tag, sub_prj, shm_size, created_by, mul_dep):
        
        #self.id = id;
        self.mul_dep = mul_dep
        self.enable_cd = enable_cd
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.last_updated_by = created_by
        self.group = group
        self.project = project
        self.pod_name = pod_name
        self.pod_label =pod_label
        self.vol_name =vol_name
        self.vol_size =vol_size
        self.sc_name =sc_name
        self.target_node =target_node
        self.con_cnt =con_cnt
        self.vol_cnt = vol_cnt
        self.shm_size = shm_size
        self.tag = tag
        self.sub_prj = sub_prj

class DeploySchema(Schema):
    id = fields.Number()
    group =  fields.Str()
    mul_dep = fields.Str()
    project =  fields.Str()
    enable_cd = fields.Str()
    pod_name = fields.Str()
    pod_label =fields.Str()
    vol_name =fields.Str()
    vol_size =fields.Str()
    sc_name =fields.Str()
    target_node =fields.Str()
    con_cnt = fields.Number()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
    shm_size = fields.Str()
    vol_cnt = fields.Number()
    tag = fields.Str()
    sub_prj = fields.Str()
    containers = fields.Nested(ContainerSchema, many=True)
    volumes = fields.Nested(VolumeSchema, many=True)