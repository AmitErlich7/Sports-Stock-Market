from database import SessionLocal, engine, Base
import models
from scraper import NBAScraper
from datetime import datetime

def fix_game_logs():
    db = SessionLocal()
    scraper = NBAScraper()
    
    try:
        print("Cleaning up match logs...")
        # Delete all existing match logs to remove "Simulation" data
        db.query(models.MatchLog).delete()
        db.commit()
        print("All match logs deleted.")

        assets = db.query(models.Asset).all()
        print(f"Found {len(assets)} assets. Fetching real last game data...")

        updated_count = 0
        for asset in assets:
            print(f"Fetching for {asset.name} ({asset.ticker})...")
            last_game = scraper.get_last_game_log(asset.id)
            
            if last_game:
                # Calculate performance score
                perf_score = last_game['pts'] + last_game['reb'] + last_game['ast']
                
                new_log = models.MatchLog(
                    asset_id=asset.id,
                    game_date=datetime.strptime(last_game['game_date'], "%b %d, %Y"),
                    opponent=last_game['matchup'],
                    stats={
                        "PTS": last_game['pts'],
                        "REB": last_game['reb'],
                        "AST": last_game['ast'],
                        "STL": last_game['stl'],
                        "BLK": last_game['blk'],
                        "TOV": last_game['tov']
                    },
                    performance_score=perf_score
                )
                db.add(new_log)
                updated_count += 1
            else:
                print(f"No game log found for {asset.name}")

        db.commit()
        print(f"Successfully updated logs for {updated_count} players.")

    except Exception as e:
        print(f"Error fixing game logs: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_game_logs()
