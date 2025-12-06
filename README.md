# Sports Stock Exchange

A real-time sports stock market where you can invest in NBA players. Prices are driven by an "Expectation Delta" algorithm based on real-life performance vs. projected stats.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**

## 🚀 Getting Started


### Option A: Quick Install (GitHub Users)
1. **Clone the repository** to your local machine:
   ```bash
   git clone <YOUR_REPO_URL>
   cd Sports-Stock-Market
   ```
2. **Run Setup** (One time only):
   - Double-click `setup_app.bat`
   - **OR** run in terminal: `.\setup_app.bat`
3. **Start the App**:
   - Double-click `start_app.bat`
   - **OR** run in terminal: `.\start_app.bat`

### Option B: Already Installed?
Start the app:
- Double-click `start_app.bat`
- **OR** run in terminal: `.\start_app.bat`

### 💻 Contributing & Development

Want to add new features? Great! Please follow this workflow:

1.  **Create a Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Make Changes**: Edit the code in your editor.
3.  **Commit Changes**:
    ```bash
    git add .
    git commit -m "Add description of your changes"
    ```
4.  **Push to GitHub**:
    ```bash
    git push origin feature/your-feature-name
    ```
5.  **Create a Pull Request**: Go to GitHub and click "Compare & pull request" to merge your changes.

## 📈 How to Use

1. **Dashboard**: View the top 50 NBA players, their current stock price, and season stats.
2. **Search**: Use the search bar to find specific players (e.g., "LeBron", "Curry").
3. **Asset Details**: Click on a player's name to view their price history chart and detailed stats.
4. **Simulate**: Click the "Simulate" button to generate a mock game performance. This will trigger the pricing algorithm and update the stock price based on how well they performed vs. their average.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI, Recharts, Framer Motion.
- **Backend**: FastAPI, SQLAlchemy, SQLite.
- **Data**: `nba_api` (Live NBA Stats).
