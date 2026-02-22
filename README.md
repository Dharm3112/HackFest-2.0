# 🛡️ OmniGuard AML (Data Policy Agent Engine)

> **OmniGuard AML** is an intelligent, high-performance Data Policy Agent built to combat money laundering at scale. It reads natural-language Anti-Money Laundering (AML) policies using Google's Gemini 2.5 Flash, extracts programmable business rules, and executes them against massive, optimized Apache Parquet datasets via DuckDB to identify illicit transactions in milliseconds.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation Instructions](#-installation-instructions)
- [Environment Variables](#-environment-variables)
- [Usage Instructions](#-usage-instructions)
- [API Endpoints](#-api-endpoints)
- [Scripts & Commands](#-scripts--commands)
- [Testing Instructions](#-testing-instructions)
- [Deployment Guide](#-deployment-guide)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements & Roadmap](#-future-improvements--roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **🧠 Intelligence Ingestion:** Drag-and-drop a policy document (PDF/TXT/MD), and the AI agent instantly extracts executable regulatory rules via Gemini 2.5 Flash Structured Outputs. Now natively handling binary PDFs via PyPDF2.
- **⚡ Massive Scale Batch Scanning:** Utilizes DuckDB's vectorized engine directly on optimized Parquet format, capable of scanning tens of millions of transaction rows in sub-seconds.
- **🎨 HexaCore Dashboard:** An immersive, dark-mode React UI powered by Framer Motion, Lucide React icons, and custom HexaCore styling (`#0B0B0B`, `#0905FE`).
- **🗃️ Virtualized Data Grid:** Uses `@tanstack/react-virtual` to render over 10,000+ AML violations flawlessly at 60 FPS without crashing the browser DOM.
- **🔍 Deep Explainability:** Features an interactive modal that juxtaposes the offending raw database transaction against the exact PDF policy citation that triggered the flag.
- **👤 Human-in-the-Loop:** Built-in workflows to acknowledge False Alarms or Freeze Accounts based on AI insights.

---

## 🛠️ Tech Stack

**Frontend (Client)**
- React 19 + Vite
- Tailwind CSS v4 (HexaCore Dark Mode Theme)
- Framer Motion (Animations)
- TanStack Table / Virtual (Virtualization)
- Axios (HTTP Client)

**Backend (Server)**
- Python 3.10+
- FastAPI (REST API Engine)
- Uvicorn (ASGI Server)
- SQLite (Application State & Violations)

**AI & Data Infrastructure**
- Google GenAI SDK (Gemini 2.5 Flash)
- DuckDB (In-process analytical SQL engine)
- Polars (Lightning-fast DataFrame operations for Parquet conversion)
- Apache Parquet (Optimized columnar storage)
- PyPDF2 (Native Binary PDF Extraction)

---

## 📂 Folder Structure

```text
HackFest-2.0/
├── DataSet
│   ├── HI-Large_Patterns.txt
│   ├── HI-Large_Trans.csv
│   ├── HI-Large_accounts.csv
│   ├── HI-Medium_Patterns.txt
│   ├── HI-Medium_Trans.csv
│   ├── HI-Medium_accounts.csv
│   ├── HI-Small_Patterns.txt
│   ├── HI-Small_Trans.csv
│   ├── HI-Small_accounts.csv
│   ├── LI-Large_Patterns.txt
│   ├── LI-Large_Trans.csv
│   ├── LI-Large_accounts.csv
│   ├── LI-Medium_Patterns.txt
│   ├── LI-Medium_Trans.csv
│   ├── LI-Medium_accounts.csv
│   ├── LI-Small_Patterns.txt
│   ├── LI-Small_Trans.csv
│   └── LI-Small_accounts.csv
├── backend
│   ├── __init__.py
│   ├── agents
│   │   ├── __init__.py
│   │   ├── db_scanner.py
│   │   └── pdf_reader_agent.py
│   ├── api
│   │   ├── __init__.py
│   │   ├── rules.py  # Upload & Rule Endpoints (PyPDF2)
│   │   └── scan.py
│   ├── data_engine
│   │   ├── check_schema.py
│   │   └── convert_to_parquet.py
│   ├── database.py
│   ├── main.py  # FastAPI application entry point
│   ├── models
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── requirements.txt
│   ├── test_scan.py
│   └── test_upload.py
├── data
│   ├── dummy_aml_policy.md
│   └── optimized_trans.parquet
├── frontend
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx  # Main Dashboard Layout
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── Dropzone.jsx
│   │   │   ├── Terminal.jsx
│   │   │   └── ViolationsTable.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── services
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── LICENSE
└── README.md  # Project documentation
```

---

## 💻 Installation Instructions

This project runs two concurrent local servers (FastAPI Backend and Vite Frontend). 

### Prerequisites
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)

### 1. Data Processing Engine Setup
We must first convert the massive, slow CSV dataset into the optimized Apache Parquet format.
```bash
# Clone the repository and navigate into it
cd HackFest-2.0

# Create and activate a Python virtual environment
python -m venv venv

# Windows Activation:
.\venv\Scripts\activate
# Mac/Linux Activation:
# source venv/bin/activate

# Install the necessary Data & Backend dependencies
pip install -r backend/requirements.txt

# Ensure the source CSV is located at 'DataSet/HI-Small_Trans.csv' (relative to root)
# Run the Data Engine to generate the 96MB Parquet file
python backend/data_engine/convert_to_parquet.py
```

### 2. Configure Environment Variables
Copy the example environment file and insert your API credentials.
```bash
cp backend/.env.example backend/.env
```
Provide your Gemini API key (see Environment Variables section below).

### 3. Start the Backend Server
Keep the Python virtual environment active.
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload
```
The backend API is now alive at `http://127.0.0.1:8001/`.

### 4. Start the Frontend Application
Open a **new separate terminal** window.
```bash
cd HackFest-2.0/frontend
npm install
npm run dev -- --port 5173
```
The React frontend is now accessible at `http://localhost:5173/`.

---

## 🔐 Environment Variables

Create exactly one `.env` file located at `backend/.env`.

```env
# Google Gemini API Key required for the Policy Ingestion Agent
GEMINI_API_KEY="your-gemini-2.5-flash-api-key"

# Port Configuration (Defaults to 8001 if omitted)
PORT=8001
```

> **Note on Resiliency:** If the `GEMINI_API_KEY` is completely missing or the internet connection drops, the application has built-in offline fallback logic. It will automatically populate the database with mock rules corresponding to `data/dummy_aml_policy.md` to ensure presentation/demo continuity.

---

## 🚀 Usage Instructions

1. **Access the Dashboard:** Open `http://localhost:5173/` in your browser.
2. **Ingest Policy:** In the "Policy Ingestion Engine" section, drag and drop the `data/dummy_aml_policy.md` (or your own custom PDF/txt file).
3. **Verify AI Extraction:** Wait for the `Gemini 2.5 Flash is Parsing...` animation to conclude. The UI will display the total number of Active Rules translated into SQL logic.
4. **Trigger Scan:** Click the blue **"Initiate Batch Scan"** button in Engine section 2.
5. **Monitor Terminal:** Watch the simulated CLI feed as DuckDB traverses millions of rows.
6. **Review Violations:** Scroll the massive virtualized table, analyze the AI Justifications, and use the Human-in-the-Loop buttons to Acknowledge or Freeze accounts.

---

## 🔌 API Endpoints

The backend is fully documented via OpenAPI (Swagger). When the backend is running, visit `http://127.0.0.1:8001/docs`.

### Core Routes:
- `POST /api/policy/upload`: Ingests a raw file (PDF/MD), triggers Gemini extraction, and saves executable SQL rules to SQLite.
- `GET /api/rules`: Returns the active AML rules formatted by the AI Agent.
- `POST /api/scan/trigger`: Instructs the DuckDB agent to scan the local `.parquet` file against the rules and lodge new violations.
- `GET /api/violations`: Retrieves a joined view of pending violations and their policy sources.
- `POST /api/violations/{id}/resolve?action=approved|escalated`: Upates the violation status via Human-in-the-Loop input.

---

## 📜 Scripts & Commands

| Command | Working Directory | Description |
|---|---|---|
| `python backend/data_engine/convert_to_parquet.py` | Root | Compresses the raw CSV dataset into high-speed Parquet. |
| `uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload` | Root | Boots the FastAPI Dev Server. |
| `python backend/test_upload.py` | Root | Automates the API hit to test Python AI extraction. |
| `python backend/test_scan.py` | Root | Automates the API hit to fire DuckDB and retrieve results. |
| `npm run dev -- --port 5173` | `/frontend` | Boots the Vite/React UI Server. |

---

## 🧪 Testing Instructions

You can programmatically verify the intelligence pipeline without using the browser UI.

1. Boot the FastAPI background server on port 8001.
2. Use the provided Python testing scripts in sequence:
   ```bash
   # Test the AI Agent and Database Insertion
   python backend/test_upload.py
   
   # Test the DuckDB Engine and Violation Flagging
   python backend/test_scan.py
   ```
3. If both scripts return `HTTP 200 SUCCESS` and output valid JSON blocks mapping to transaction IDs, your engine is stable.

---

## 🌍 Deployment Guide

### Assuming a Docker / Cloud Sandbox Environment
1. **Containerization (Future):** Create a multi-stage `Dockerfile`. The Backend (Python) and Frontend (dist assets served via Nginx) can be containerized separately.
2. **Cloud Object Storage (S3 / GCS):** Currently, the app uses a local filesystem `data/optimized_trans.parquet` file. In Production, point the DuckDB `HTTPFS` extension to read the remote Parquet datasets.
3. **Database Migration:** Replace local `SQLite` (`data/app_state.db`) with a managed PostgreSQL instance for horizontal scalability of the rule-state.

---

## 🤝 Contributing Guidelines

1. Fork the repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingOptimization`).
3. Adhere to HexaCore CSS Variables (`text-primary`, `bg-surface`) if changing the UI.
4. Run `npm run lint` inside `/frontend` and ensure no console warnings exist.
5. Commit your Changes (`git commit -m 'Add some AmazingOptimization'`).
6. Push to the Branch (`git push origin feature/AmazingOptimization`).
7. Open a Pull Request referencing the Hackathon Issue Number.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details. Built for the IBM Hackathon.

---

## ⚙️ Troubleshooting

**"DuckDB Error: Invalid Input Error"** 
- Ensure you have run Phase 1: `python backend/data_engine/convert_to_parquet.py`
- Ensure `numpy` and `pandas` are installed in your `venv` for terminal output bridging.

**"Tailwind CSS / PostCSS build failing on Vite start"**
- We migrated to Tailwind v4. Ensure you run `npm install @tailwindcss/postcss --save-dev` if your local cache is stale. 
- Do NOT use the old `@tailwind` directives; use `@import "tailwindcss";` in `index.css`.

**"Gemini API 400 Errors or Rate Limits"**
- The Free Tier rate limits can hit quickly. Wait 1 min. Alternatively, disable the API key inside `.env` temporarily; the graceful fallback will engage instantly to save your presentation flow.

**"Port 8001 is already in use"**
- Kill hanging Python instances (Windows: `Stop-Process -Name "python" -Force`, Mac/Linux: `pkill -f python`).
<!--
---

## 🗺️ Strategic Technical Roadmap: The Future of OmniGuard AML

As we scale OmniGuard AML from a high-performance prototype into an enterprise-grade compliance platform, our engineering initiatives are focused on expanding ingestion capabilities, scaling data infrastructure, and deepening our AI-driven risk intelligence.

### ✅ 1. Omni-Channel Document Intelligence (Native PDF Parsing) [SHIPPED]
* **Objective:** Eliminate manual data entry and preprocess bottlenecks by enabling the system to natively ingest and understand heavy regulatory PDFs.
* **Technical Approach:** Integrated native `PyPDF2` binary stream extraction to accurately parse digital PDFs before routing the text to the Gemini AI Agent. *(Note: Image-based OCR via Tesseract is still scheduled for Phase 2).*
* **Business Impact:** Drastically reduces the time-to-compliance for financial institutions dealing with legacy PDF mandates, ensuring zero regulatory lag.
* **Implementation Complexity:** **Shipped.** (Medium complexity achieved via robust FastAPI buffer-stream handling of binary file uploads).

### 2. Cloud-Native Data Virtualization (S3 Pipeline & Compute Separation)
* **Objective:** Achieve infinite horizontal scalability by decoupling the DuckDB compute engine from local storage restrictions.
* **Technical Approach:** Migrate the local Apache Parquet datasets to remote, cost-effective S3 block storage. Utilize the DuckDB `httpfs` extension to execute high-speed, vectorized API scans directly over the wire, querying only the necessary columnar data without downloading entire files.
* **Business Impact:** Enables the platform to seamlessly query petabytes of transactional data across global bank divisions simultaneously, driving infrastructure costs down while maintaining millisecond query latency.
* **Implementation Complexity:** **Low.** DuckDB is natively designed for cloud-storage integration; the primary effort lies in securely managing IAM roles and network optimizing the S3 buckets.

### 3. Generative Case Narratives (Advanced Explainability)
* **Objective:** Transform binary rule-flagging into comprehensive, audit-ready compliance reports.
* **Technical Approach:** Evolve the current exact-text matching system into a secondary generative workflow. When DuckDB flags a violation, the isolated database row and the triggered rule will be fed back into the Gemini model. The LLM will then synthesize a specialized, natural-language narrative tailored specifically for the investigating compliance officer.
* **Business Impact:** Slashes the time human investigators spend writing Suspicious Activity Reports (SARs), serving as a true AI co-pilot that drafts the initial investigation summary for human review.
* **Implementation Complexity:** **Medium.** Requires careful prompt engineering and strict JSON schema enforcement to ensure the generated narratives remain factual and do not hallucinate outside the bounds of the specific transaction data.

### 4. Enterprise Knowledge Graphs (Entity Resolution & Network Mapping)
* **Objective:** Uncover hidden fraud syndicates and complex money-laundering rings that evade single-transaction rules (e.g., sophisticated layering or smurfing).
* **Technical Approach:** Deploy Graph Neural Networks (GNNs) and visual graph databases (like Neo4j) to map the sender and receiver metadata extracted from the Parquet files. This creates a dynamically updating, multi-dimensional web of financial relationships.
* **Business Impact:** Shifts the platform from reactive rule-checking to proactive threat hunting. Investigators can visually trace illicit fund flows across shell companies and mule accounts in real-time.
* **Implementation Complexity:** **High.** Architecting highly performant graph databases at a massive transactional scale requires specialized engineering and complex real-time algorithmic processing.

### 5. Continuous Active Learning (Automated Model Feedback)
* **Objective:** Create a self-improving threat detection lifecycle based on human investigator feedback.
* **Technical Approach:** Instrument the "Human-in-the-Loop" dashboard to securely capture when an officer marks a flag as a "False Alarm" or "Escalated." This telemetry data will be piped into a continuous fine-tuning pipeline, slightly adjusting the rule-extraction weights and generative thresholds of the underlying LLM over time.
* **Business Impact:** The platform becomes smarter the more the enterprise uses it, drastically reducing false-positive rates, combating model drift, and widening the competitive moat against static legacy vendors.
* **Implementation Complexity:** **High.** Requires establishing secure, automated MLOps pipelines and rigorous guardrails to prevent the model from "unlearning" critical baseline regulations.

### 6. Cross-Border Federation (Multi-Jurisdictional Engine)
* **Objective:** Allow global banks to apply different, conflicting AML rulesets to transactions depending on their geographic routing.
* **Technical Approach:** Implement a geolocation tagging and policy-routing layer within the DuckDB SQL translation phase. The system will ingest policies from FINRA (US), FCA (UK), and MAS (Singapore) simultaneously, assigning rules to specific transactional sub-queries based on sender/receiver ISO country codes.
* **Business Impact:** Positions OmniGuard as a unified, global compliance brain, allowing multinational banks to consolidate their disjointed regional risk software into a single pane of glass.

* **Implementation Complexity:** **Medium.** The query orchestration logic will require careful optimization to prevent latency spikes while joining multiple jurisdictional rulesets against the primary Parquet table.
-->