from sqlalchemy import Column, String
from datetime import datetime
from .entity import Entity, Base
from marshmallow import Schema, fields
from sqlalchemy import create_engine, Column, String, Integer, DateTime

class UserSession(Base):
    __tablename__ = 'user_session'
    id = Column(Integer, primary_key=True)
    uid = Column(String)
    session_id = Column(String)
    created_at = Column(DateTime)
    expired_at = Column(DateTime)
    team_name = Column(String)
    team_id = Column(String)
    sil_name = Column(String)
    sil_id = Column(String)
    sa_name = Column(String)
    sa_id = Column(String)
    com_name = Column(String)
    com_id = Column(String)
    grade = Column(String)

    def __init__(self, uid):
        
        self.uid = uid 
        self.created_at = datetime.now()

class UserSessionSchema(Schema):
    id = fields.Number()
    uid = fields.Str()
    session_id = fields.Str()
    created_at = fields.DateTime()
    expired_at = fields.DateTime()
    grade = fields.Str()
    team_name = fields.Str()
    team_id = fields.Str()
    sil_name = fields.Str()
    sil_id = fields.Str()
    sa_name = fields.Str()
    sa_id = fields.Str()
    com_name = fields.Str()
    com_id = fields.Str()

"""
'grade': gradeStr , 
                  'teamname': teamName, 'teamid': teamCode,
                  'silname': silName, 'silid': silCode,
                 'saname': saName, 'said': saCode,
                 'comname': comName, 'comid': comCode, 'sessionId': sessionId} 
"""