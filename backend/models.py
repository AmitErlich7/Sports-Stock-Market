from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "profiles" # Using profiles to match Supabase convention if we switch
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    balance = Column(Float, default=1000.00)
    
    portfolio_items = relationship("Portfolio", back_populates="user")

class Asset(Base):
    __tablename__ = "assets"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    ticker = Column(String, unique=True, nullable=False)
    type = Column(String) # PLAYER or TEAM
    current_price = Column(Float, default=10.00)
    projected_stats = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    match_logs = relationship("MatchLog", back_populates="asset")
    price_history = relationship("PriceHistory", back_populates="asset")

class Portfolio(Base):
    __tablename__ = "portfolio"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"))
    asset_id = Column(String, ForeignKey("assets.id"))
    quantity = Column(Integer, default=0)
    average_buy_price = Column(Float, nullable=False)

    user = relationship("User", back_populates="portfolio_items")
    asset = relationship("Asset")

class MatchLog(Base):
    __tablename__ = "match_logs"
    id = Column(String, primary_key=True, default=generate_uuid)
    asset_id = Column(String, ForeignKey("assets.id"))
    game_date = Column(DateTime(timezone=True), nullable=False)
    opponent = Column(String)
    stats = Column(JSON, nullable=False)
    performance_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    asset = relationship("Asset", back_populates="match_logs")

class PriceHistory(Base):
    __tablename__ = "price_history"
    id = Column(String, primary_key=True, default=generate_uuid)
    asset_id = Column(String, ForeignKey("assets.id"))
    price = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    asset = relationship("Asset", back_populates="price_history")
