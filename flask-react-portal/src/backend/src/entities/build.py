from sqlalchemy import Column, String
from datetime import datetime
from .entity import Entity, Base
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime

class Build(Base):
    __tablename__ = 'build'
    id = Column(Integer, primary_key=True)
    cudnn = Column(String)
    sort = Column(String)
    enable_cd = Column(String)
    custom = Column(String)
    script = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)
    group = Column(String)
    project = Column(String)
    base = Column(String)
    maintainer = Column(String)
    py_ver = Column(String)
    apt_pkgs = Column(String)
    pip_pkgs = Column(String)
    npm_pkgs = Column(String)
    sshd = Column(String)
    utf8 = Column(String)
    vim = Column(String)
    set_ld_path = Column(String)
    supd = Column(String)
    supd_programs = Column(String)
    expose_ports = Column(String)
    node_ver = Column(String)
    jup_hub = Column(String)
    jup_act = Column(String)
    cmd = Column(String)
    sub_prj = Column(String)
    tag = Column(String)
    image_path = Column(String)
    image_tag = Column(String)
    
    def __init__(self, id, script, cudnn, # , sort,
        created_at, group, project , base  ,maintainer  ,py_ver,apt_pkgs,pip_pkgs, 
        npm_pkgs, sshd,utf8,vim,set_ld_path,supd  
        ,supd_programs,expose_ports,node_ver,jup_hub,jup_act,cmd,sub_prj,tag, sort, 
        enable_cd, custom, created_by, image_path, image_tag):
        
        #self.id = id;
        self.image_path = image_path
        self.image_tag = image_tag
        self.cudnn = cudnn
        self.enable_cd = enable_cd
        self.custom = custom
        self.sort = sort
        self.script=script
        self.created_at = created_at
        self.updated_at = datetime.now()
        self.last_updated_by = created_by
        self.group = group
        self.project = project
        self.base  = base
        self.maintainer  = maintainer
        self.py_ver  = py_ver
        self.apt_pkgs  = apt_pkgs
        self.pip_pkgs  = pip_pkgs
        self.npm_pkgs = npm_pkgs
        self.sshd  = sshd
        self.utf8  = utf8
        self.vim  = vim
        self.set_ld_path  = set_ld_path
        self.supd  = supd
        self.supd_programs  = supd_programs
        self.expose_ports  = expose_ports
        self.node_ver  = node_ver
        self.jup_hub  = jup_hub
        self.jup_act  = jup_act
        self.cmd  = cmd
        self.sub_prj  = sub_prj
        self.tag  = tag

class BuildSchema(Schema):
    id = fields.Number()
    group =  fields.Str()
    project =  fields.Str()
    base =  fields.Str()
    cudnn = fields.Str()
    sort = fields.Str()
    script = fields.Str()
    maintainer =  fields.Str()
    py_ver =  fields.Str()
    apt_pkgs =  fields.Str()
    pip_pkgs =  fields.Str()
    npm_pkgs = fields.Str()
    sshd =  fields.Str()
    utf8 =  fields.Str()
    vim =  fields.Str()
    set_ld_path =  fields.Str()
    supd =  fields.Str()
    supd_programs =  fields.Str()
    expose_ports =  fields.Str()
    node_ver =  fields.Str()
    jup_hub =  fields.Str()
    jup_act =  fields.Str()
    cmd =  fields.Str()
    sub_prj =  fields.Str()
    tag =  fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
    custom = fields.Str()
    enable_cd = fields.Str()
    image_path = fields.Str()
    image_tag = fields.Str()
