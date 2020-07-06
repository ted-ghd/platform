from sqlalchemy import Column, String
from datetime import datetime
from .entity import Entity, Base
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime

class Integration(Base):
    __tablename__ = 'integration'
    id = Column(Integer, primary_key=True)
    uid = Column(String)
    target = Column(String)
    endPoint= Column(String)
    accessKey = Column(String)
    secretKey = Column(String)
    projectId = Column(String)

    
    def __init__(self, id, target, uid, endPoint, accessKey, secretKey, projectId):
        
        #self.id = id;
        self.uid = uid
        self.target = target
        self.endPoint = endPoint
        self.accessKey=accessKey
        self.secretKey=secretKey
        self.projectId=projectId

class IntegrationSchema(Schema):
    id = fields.Number()
    uid = fields.Str()
    endPoint = fields.Str()
    target = fields.Str()
    accessKey = fields.Str()
    secretKey = fields.Str()
    projectId = fields.Str()