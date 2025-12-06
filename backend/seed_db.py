from database import SessionLocal, engine, Base
import models
from scraper import NBAScraper

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        count = db.query(models.Asset).count()
        if count > 0:
            print(f"Database has {count} assets. Clearing them to refresh IDs...")
            # Force refresh to fix IDs
            db.query(models.Asset).delete()
            db.commit()

        print("Fetching top 50 players...")
        scraper = NBAScraper()
        players = scraper.get_top_50_players()
        
        if not players:
            print("Failed to fetch players.")
            return

        print(f"Seeding {len(players)} players...")
        added_count = 0
        for p in players:
            # Check for duplicates
            if not db.query(models.Asset).filter(models.Asset.ticker == p['ticker']).first():
                asset = models.Asset(**p)
                db.add(asset)
                added_count += 1
        
        db.commit()
        print(f"Successfully added {added_count} assets.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
