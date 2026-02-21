# OmniGuard AML: Data Policy Agent Engine

OmniGuard AML is an intelligent, high-performance Data Policy Agent built for the IBM Hackathon. It reads natural-language Anti-Money Laundering (AML) policies using Google's Gemini 2.5 Flash, extracts programmable business rules, and executes them against massive Apache Parquet datasets via DuckDB to identify illicit transactions in milliseconds.

## 🚀 Features

*   **Intelligence Ingestion:** Drag-and-drop a policy document (PDF/TXT) and the agent extracts the executable rules automatically via Gemini 2.5 Flash.
*   **Massive Scale Batch Scanning:** Utilizes the DuckDB vectorized engine directly on optimized Parquet format to scan millions of rows in sub-seconds.
*   **HexaCore Dashboard:** An immersive, dark-mode React UI (`framer-motion`, `lucide-react`) equipped with virtualization (`@tanstack/react-virtual`) to render 10,000+ AML violations flawlessly at 60 FPS.
*   **Explainability:** Human-in-the-Loop approval workflows side-by-side with exact document citations for the flagged DB conditions.

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Axios.
*   **Backend:** FastAPI (Python), SQLite (Application State).
*   **AI Engine:** Google GenAI SDK (Gemini 2.5 Flash) with Structured Output logic.
*   **Data Engine:** Polars (CSV conversions), DuckDB (Parquet vector scanning).

---

## 💻 How to Run This Project Locally

This project requires running two concurrent terminal windows—one for the Python backend and one for the React frontend.

### Prerequisites
*   [Python 3.10+](https://www.python.org/)
*   [Node.js 18+](https://nodejs.org/)
*   The raw IBM `DataSet/HI-Small_Trans.csv` (For Data Engine generation).

### Step 1: Prepare the Dataset & Virtual Environment
The system is designed to read ultra-fast Parquet files. You need to download the CSV dataset and convert it using our engine.

1. Open a terminal in the root directory: `cd HackFest-2.0`
2. Create your Virtual Environment: `python -m venv venv`
3. Activate the Environment:
   * **Windows:** `.\venv\Scripts\activate`
   * **Mac/Linux:** `source venv/bin/activate`
4. Install dependencies: `pip install -r backend/requirements.txt`
5. Ensure the IBM Hackathon CSV is located at `DataSet/HI-Small_Trans.csv` (relative to the root project).
6. Convert the CSV to Parquet: `python backend/data_engine/convert_to_parquet.py`
   * *(This will create `data/optimized_trans.parquet`)*

### Step 2: Configure the AI
1. Copy the example configuration file: `cp backend/.env.example backend/.env`
2. Insert your actual Gemini API Key inside `backend/.env`.
   * *Note: The system has built-in fallback logic! If you leave the key blank, or internet goes out, it will still output dummy rules matching `data/dummy_aml_policy.md` so the hackathon demo won't break on stage.*

### Step 3: Run the Backend Server
Keep your Virtual Environment activated from Step 1.
1. Run the FastAPI server via Uvicorn:
   ```bash
   uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload
   ```
2. The API is now actively listening on `http://127.0.0.1:8001`. Leave this terminal window running.

### Step 4: Run the HexaCore Frontend
Open a **NEW** terminal window.
1. Navigate to the frontend UI: `cd HackFest-2.0/frontend`
2. Install npm dependencies: `npm install`
3. Start the Vite React Server: 
   ```bash
   npm run dev -- --port 5173
   ```
4. Check your browser. The live dashboard is locally hosted at **`http://localhost:5173/`**.

---

## 🎬 How to Demo to Judges

Once both servers are running:
1. Show the Judges the `data/dummy_aml_policy.md` file so they can see it's clear English.
2. Drag and drop that MD file into the **Deploy AML Policy** zone on the Web App.
3. Show the UI extracting exactly 3 rules (e.g., "Massive Single Wire", "Micro-Structuring").
4. Click **Initiate Batch Scan**. 
5. Emphasize the live Secure Terminal simulation tracking the DuckDB compute cores.
6. The app will catch precisely **69 violations**.
7. Click any violation's *Justification* cell to open the **Explainability Modal**. Show the Judges how the Database logic aligns side-by-side with the pure PDF text quote.
8. Click **Freeze Account** (Escalate) or **Acknowledge** (False Alarm) to prove it's a true Human AI interaction flow.