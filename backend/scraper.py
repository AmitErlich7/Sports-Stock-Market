from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.static import players
from nba_api.stats.endpoints import playergamelog, leaguedashplayerstats
import pandas as pd
from datetime import datetime, timezone

class NBAScraper:
    def get_live_games(self):
        """
        Fetches live games for today.
        """
        try:
            board = scoreboard.ScoreBoard()
            games = board.games.get_dict()
            return games
        except Exception as e:
            print(f"Error fetching live games: {e}")
            return []

    def search_players(self, name: str):
        """
        Search for a player by name.
        """
        return players.find_players_by_full_name(name)

    def get_player_stats(self, player_id: int, season='2024-25'):
        """
        Get game logs for a player.
        """
        try:
            # Note: Season might need adjustment depending on current date
            gamelog = playergamelog.PlayerGameLog(player_id=player_id, season=season)
            df = gamelog.get_data_frames()[0]
            return df.to_dict(orient='records')
        except Exception as e:
            print(f"Error fetching player stats for {player_id}: {e}")
            return []

    def get_last_game_log(self, player_id: str):
        """
        Get the most recent game log for a player.
        """
        try:
            # Try current season first
            for season in ['2024-25', '2023-24']:
                gamelog = playergamelog.PlayerGameLog(player_id=player_id, season=season)
                df = gamelog.get_data_frames()[0]
                if not df.empty:
                    log = df.iloc[0]
                    return {
                        "game_date": log['GAME_DATE'],
                        "matchup": log['MATCHUP'],
                        "pts": int(log['PTS']),
                        "reb": int(log['REB']),
                        "ast": int(log['AST']),
                        "stl": int(log['STL']),
                        "blk": int(log['BLK']),
                        "tov": int(log['TOV']),
                        "wl": log['WL']
                    }
            return None
        except Exception as e:
            print(f"Error fetching last game log for {player_id}: {e}")
            return None

    def get_top_50_players(self):
        """
        Fetch top 50 players by Points Per Game for the current season.
        """
        try:
            # Try current season (2025-26)
            try:
                stats = leaguedashplayerstats.LeagueDashPlayerStats(season='2025-26', per_mode_detailed='PerGame')
                df = stats.get_data_frames()[0]
            except:
                print("2025-26 not found, trying 2024-25")
                stats = leaguedashplayerstats.LeagueDashPlayerStats(season='2024-25', per_mode_detailed='PerGame')
                df = stats.get_data_frames()[0]
            
            top_50 = df.sort_values(by='PTS', ascending=False).head(50)
            
            results = []
            for _, player in top_50.iterrows():
                # Generate ticker: First Initial + Last Name (e.g. L.JAMES)
                name_parts = player['PLAYER_NAME'].split()
                if len(name_parts) >= 2:
                    ticker = f"{name_parts[0][0]}.{name_parts[-1]}".upper()[:6]
                else:
                    ticker = player['PLAYER_NAME'][:4].upper()

                results.append({
                    "id": str(player['PLAYER_ID']), # Add ID for images
                    "name": player['PLAYER_NAME'],
                    "ticker": ticker, 
                    "current_price": round(player['PTS'] * 2, 2), # Initial price based on PTS
                    "projected_stats": {
                        "PTS": player['PTS'],
                        "AST": player['AST'],
                        "REB": player['REB'],
                        "STL": player['STL'],
                        "BLK": player['BLK'],
                        "TOV": player['TOV']
                    }
                })
            return results
        except Exception as e:
            print(f"Error fetching top 50 players: {e}")
            return []

    def get_top_performer(self):
        """
        Get the top performer from the last available game date.
        """
        try:
            # Get yesterday's leaders (or today's if games happened)
            # Using LeagueDashPlayerStats but sorting by Fantasy Points or PTS for 'Performance'
            try:
                # Try current season
                stats = leaguedashplayerstats.LeagueDashPlayerStats(
                    season='2024-25', 
                    last_n_games=1, 
                    per_mode_detailed='PerGame'
                )
                df = stats.get_data_frames()[0]
            except:
                print("Could not fetch last game stats")
                return None
            
            if df.empty:
                return None
                
            # Sort by Points for now as "Top Performance"
            top_player = df.sort_values(by='PTS', ascending=False).iloc[0]
            
            return {
                "id": str(top_player['PLAYER_ID']),
                "name": top_player['PLAYER_NAME'],
                "stats": {
                    "PTS": int(top_player['PTS']),
                    "AST": int(top_player['AST']),
                    "REB": int(top_player['REB'])
                }
            }
        except Exception as e:
            print(f"Error fetching top performer: {e}")
            return None

# Example usage
if __name__ == "__main__":
    scraper = NBAScraper()
    # print(scraper.get_live_games())
    # lebron = scraper.search_players("LeBron James")[0]
    # print(scraper.get_player_stats(lebron['id']))
