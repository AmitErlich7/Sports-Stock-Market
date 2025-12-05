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

    def get_top_50_players(self):
        """
        Fetch top 50 players by Points Per Game for the current season.
        """
        try:
            # Try current season first, fallback to previous if needed
            try:
                stats = leaguedashplayerstats.LeagueDashPlayerStats(season='2024-25', per_mode_detailed='PerGame')
                df = stats.get_data_frames()[0]
            except:
                print("2024-25 not found, trying 2023-24")
                stats = leaguedashplayerstats.LeagueDashPlayerStats(season='2023-24', per_mode_detailed='PerGame')
                df = stats.get_data_frames()[0]
            
            top_50 = df.sort_values(by='PTS', ascending=False).head(50)
            
            results = []
            for _, player in top_50.iterrows():
                # Generate ticker: First Initial + Last Name (e.g. L.JAMES)
                # Handle potential duplicates by appending ID if needed in a real app, 
                # but for now this is better than just 4 letters of last name.
                name_parts = player['PLAYER_NAME'].split()
                if len(name_parts) >= 2:
                    ticker = f"{name_parts[0][0]}.{name_parts[-1]}".upper()[:6]
                else:
                    ticker = player['PLAYER_NAME'][:4].upper()

                results.append({
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

# Example usage
if __name__ == "__main__":
    scraper = NBAScraper()
    # print(scraper.get_live_games())
    # lebron = scraper.search_players("LeBron James")[0]
    # print(scraper.get_player_stats(lebron['id']))
