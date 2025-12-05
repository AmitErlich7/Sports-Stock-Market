# Sports Stock Exchange

A real-time sports stock market where you can invest in NBA players. Prices are driven by an "Expectation Delta" algorithm based on real-life performance vs. projected stats.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**

## 🚀 Getting Started

### Option A: Easy Start (Windows)
Just double-click the `start_app.bat` file in this folder! 
It will automatically open the backend and frontend for you.

### Option B: Manual Setup

#### 1. Backend Setup (Python)

The backend handles data fetching (NBA API), pricing logic, and the database.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows**: `.\venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the Database** (Fetch top 50 players):
   ```bash
   python seed_db.py
   ```

6. Start the Backend Server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The API will be running at `http://localhost:8000`.

### 2. Frontend Setup (Next.js)

The frontend is a modern dashboard built with Next.js, Tailwind CSS, and Shadcn UI.

1. Open a new terminal and navigate to the project root:
   ```bash
   cd ..
   # or cd C:\path\to\Sports-Stock-Market
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Frontend Server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📈 How to Use

1. **Dashboard**: View the top 50 NBA players, their current stock price, and season stats.
2. **Search**: Use the search bar to find specific players (e.g., "LeBron", "Curry").
3. **Asset Details**: Click on a player's name to view their price history chart and detailed stats.
4. **Simulate**: Click the "Simulate" button to generate a mock game performance. This will trigger the pricing algorithm and update the stock price based on how well they performed vs. their average.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI, Recharts, Framer Motion.
- **Backend**: FastAPI, SQLAlchemy, SQLite.
- **Data**: `nba_api` (Live NBA Stats).
