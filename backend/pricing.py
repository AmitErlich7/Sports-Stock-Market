class PricingEngine:
    def __init__(self, sensitivity=0.1):
        """
        sensitivity: How much the price reacts to the delta.
        """
        self.sensitivity = sensitivity

    def calculate_performance_score(self, stats: dict) -> float:
        """
        Calculate a single performance score from stats (Fantasy points style).
        """
        # Simple fantasy scoring
        points = stats.get('PTS', 0)
        assists = stats.get('AST', 0)
        rebounds = stats.get('REB', 0)
        steals = stats.get('STL', 0)
        blocks = stats.get('BLK', 0)
        turnovers = stats.get('TOV', 0)

        score = (points * 1.0) + (assists * 1.5) + (rebounds * 1.2) + (steals * 3.0) + (blocks * 3.0) - (turnovers * 1.0)
        return float(score)

    def calculate_new_price(self, current_price: float, projected_score: float, actual_score: float) -> float:
        """
        Calculate new price based on Expectation Delta.
        """
        if projected_score == 0:
            return current_price # Avoid division by zero

        delta_percent = (actual_score - projected_score) / projected_score
        
        # Dampen the effect
        price_change_percent = delta_percent * self.sensitivity
        
        new_price = current_price * (1 + price_change_percent)
        return round(max(0.01, new_price), 2) # Ensure price doesn't go below 0.01

# Example
if __name__ == "__main__":
    engine = PricingEngine()
    old_price = 10.00
    proj = 30.0 # Expected fantasy points
    actual = 45.0 # Great game
    new_price = engine.calculate_new_price(old_price, proj, actual)
    print(f"Old: {old_price}, New: {new_price}")
