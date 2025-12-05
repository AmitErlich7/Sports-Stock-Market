from nba_api.stats.endpoints import leaguedashplayerstats
import pandas as pd

def get_top_50_players():
    print("Fetching top 50 players...")
    # Fetch league leaders for the 2024-25 season
    # Note: If 2024-25 is not available yet in the API (pre-season), we might need 2023-24
    try:
        stats = leaguedashplayerstats.LeagueDashPlayerStats(season='2025-26', per_mode_detailed='PerGame')
        df = stats.get_data_frames()[0]
    except:
        print("2025-26 not found, trying 2024-25")
        stats = leaguedashplayerstats.LeagueDashPlayerStats(season='2024-25', per_mode_detailed='PerGame')
        df = stats.get_data_frames()[0]
    
    # Sort by Points (PTS) to get top players
    top_50 = df.sort_values(by='PTS', ascending=False).head(50)
    
    results = []
    for _, player in top_50.iterrows():
        results.append({
            "name": player['PLAYER_NAME'],
            "id": player['PLAYER_ID'],
            "stats": {
                "PTS": player['PTS'],
                "AST": player['AST'],
                "REB": player['REB'],
                "STL": player['STL'],
                "BLK": player['BLK'],
                "TOV": player['TOV']
            }
        })
    return results

if __name__ == "__main__":
    players = get_top_50_players()
    print(f"Found {len(players)} players")
    print(players[0])
