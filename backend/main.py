from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
from scraper import NBAScraper
from pricing import PricingEngine
from datetime import datetime, timedelta
import random

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sports Stock Exchange API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scraper = NBAScraper()
pricing_engine = PricingEngine()

@app.get("/")
def read_root():
    return {"message": "Sports Stock Exchange API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/assets")
def get_assets(db: Session = Depends(get_db)):
    return db.query(models.Asset).all()

@app.post("/assets/init")
def init_assets(db: Session = Depends(get_db)):
    """
    Initialize some dummy assets if empty.
    """
    if db.query(models.Asset).count() == 0:
        print("Fetching real NBA data...")
        players = scraper.get_top_50_players()
        
        if not players:
            # Fallback if API fails
            # Fallback if API fails
            players = [
                {"id": "2544", "name": "LeBron James", "ticker": "LBJ", "current_price": 50.0, "projected_stats": {"PTS": 25.0, "AST": 7.0, "REB": 7.0}},
                {"id": "201939", "name": "Stephen Curry", "ticker": "SC30", "current_price": 45.0, "projected_stats": {"PTS": 28.0, "AST": 5.0, "REB": 4.0}},
                {"id": "1629029", "name": "Luka Doncic", "ticker": "LUKA", "current_price": 55.0, "projected_stats": {"PTS": 32.0, "AST": 9.0, "REB": 8.0}},
            ]
            
        for p in players:
            # Check if ticker exists (handle duplicates from simple ticker generation)
            if not db.query(models.Asset).filter(models.Asset.ticker == p['ticker']).first():
                asset = models.Asset(**p)
                db.add(asset)
        db.commit()
        return {"message": f"Initialized {len(players)} assets"}
    return {"message": "Assets already exist"}

@app.post("/simulate")
def simulate_game(asset_id: str, db: Session = Depends(get_db)):
    """
    Simulate a game for an asset (or fetch real stats if available).
    For MVP, we might mock the 'real' stats if no live game is on.
    """
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # 1. Get Real Stats (or Mock)
    # In a real scenario, we'd call scraper.get_player_stats(asset.player_id)
    # For MVP demo, let's generate random 'actual' stats based on projection
    
    proj = asset.projected_stats
    actual_stats = {
        "PTS": proj.get("PTS", 20) * random.uniform(0.8, 1.2),
        "AST": proj.get("AST", 5) * random.uniform(0.8, 1.2),
        "REB": proj.get("REB", 5) * random.uniform(0.8, 1.2),
        "STL": random.randint(0, 3),
        "BLK": random.randint(0, 2),
        "TOV": random.randint(0, 5)
    }

    # 2. Calculate Performance
    proj_score = pricing_engine.calculate_performance_score(proj)
    actual_score = pricing_engine.calculate_performance_score(actual_stats)

    # 3. Update Price
    new_price = pricing_engine.calculate_new_price(asset.current_price, proj_score, actual_score)
    
    # 4. Record History
    asset.current_price = new_price
    
    match_log = models.MatchLog(
        asset_id=asset.id,
        game_date=models.func.now(),
        opponent="Simulation",
        stats=actual_stats,
        performance_score=actual_score
    )
    db.add(match_log)
    
    price_history = models.PriceHistory(
        asset_id=asset.id,
        price=new_price
    )
    db.add(price_history)
    
    db.commit()
    
    return {
        "asset": asset.name,
        "old_price": asset.current_price, # Note: this is actually new price now
        "new_price": new_price,
        "actual_score": actual_score,
        "projected_score": proj_score
    }

@app.get("/assets/{asset_id}")
def get_asset_details(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@app.get("/assets/{asset_id}/logs")
def get_asset_logs(asset_id: str, db: Session = Depends(get_db)):
    """
    Get match logs (recent games) for an asset.
    """
    try:
        logs = db.query(models.MatchLog).filter(models.MatchLog.asset_id == asset_id).order_by(models.MatchLog.game_date.desc()).all()
        
        # If no logs in DB, try to fetch real last game
        if not logs:
            scraper = NBAScraper()
            last_game = scraper.get_last_game_log(asset_id)
            
            if last_game:
                # Calculate performance score (Generic algo for now: PTS + REB + AST)
                perf_score = last_game['pts'] + last_game['reb'] + last_game['ast']
                
                new_log = models.MatchLog(
                    asset_id=asset_id,
                    game_date=datetime.strptime(last_game['game_date'], "%b %d, %Y"),
                    opponent=last_game['matchup'],
                    stats={
                        "PTS": last_game['pts'],
                        "REB": last_game['reb'],
                        "AST": last_game['ast']
                    },
                    performance_score=perf_score
                )
                db.add(new_log)
                db.commit()
                db.refresh(new_log)
                return [new_log]
                
        return logs
    except Exception as e:
        print(f"Error getting logs for {asset_id}: {e}")
        return []

@app.get("/assets/{asset_id}/history")
def get_asset_history(asset_id: str, db: Session = Depends(get_db)):
    history = db.query(models.PriceHistory).filter(models.PriceHistory.asset_id == asset_id).order_by(models.PriceHistory.timestamp).all()
    return history

@app.get("/top-performer")
def get_top_performer():
    """
    Returns the top performing player from the last game night.
    """
    performer = scraper.get_top_performer()
    if not performer:
        # Fallback Mock Data if no games/error
        return {
            "id": "2544", # LeBron
            "name": "LeBron James",
            "stats": {"PTS": 35, "AST": 9, "REB": 8}
        }
    return performer
