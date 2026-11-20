# Project AgroSense — SDG 13 Smart Irrigation Monitor

Project AgroSense is an IoT-inspired micro-irrigation and predictive analytics web platform aligned with **UN SDG 13 (Climate Action)**. It ingests soil telemetry (moisture, temperature, NPK), evaluates irrigation needs through a Python predictive microservice, persists logs in MongoDB, and displays live status on a React cooperative dashboard.

---

## Architecture & Tech Stack

| Layer | Technology | Default Port |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) + Tailwind CSS | `5173` |
| **Backend (MVC)** | Node.js, Express.js, Mongoose | `5000` |
| **AI Microservice** | Python, FastAPI, Uvicorn (`uv`) | `8000` |
| **Database** | MongoDB (Local Community or Atlas) | `27017` |

### Project Structure
```text
agrosense/
├── ai-service/                 # Python FastAPI predictive engine
│   ├── pyproject.toml
│   ├── uv.lock
│   └── predict.py
├── backend/                    # Node.js + Express MVC REST API
│   ├── controllers/
│   │   └── telemetryController.js
│   ├── models/
│   │   └── SensorLog.js
│   ├── routes/
│   │   └── apiRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/                   # React + Tailwind CSS dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure the following tools are installed on your machine:

* **Git** — `git --version`
* **Node.js (v18+)** — `node -v` and `npm -v`
* **Python (v3.10+)** — `python3 --version` (or `python --version` on Windows)
* **`uv` (Recommended for Python)** — `uv --version` ([Install uv](https://docs.astral.sh/uv/getting-started/installation/))
* **MongoDB Community Server** — `mongod --version` ([Download MongoDB](https://www.mongodb.com/try/download/community)) *or a free MongoDB Atlas cluster*

---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd agrosense
```

### 2. Start MongoDB
Run the command matching your operating system:

* **Windows (PowerShell as Administrator):**
  ```powershell
  net start MongoDB
  ```
* **macOS (Homebrew):**
  ```bash
  brew services start mongodb-community
  ```
* **Linux / WSL (Ubuntu):**
  ```bash
  sudo systemctl start mongod
  ```
  *(If `systemd` is not enabled in WSL, run `sudo mkdir -p /data/db && sudo mongod --dbpath /data/db` in a separate terminal tab.)*

> **Using MongoDB Atlas?** Skip starting a local service and replace `mongodb://127.0.0.1:27017/agrosense` in `backend/server.js` with your Atlas connection string.

---

## Running the Application

Open **three separate terminal tabs/windows** from the `agrosense/` root folder and start each service.

### Terminal 1 — Python AI Microservice (Port `8000`)

**Using `uv` (Recommended — all OS):**
```bash
cd ai-service
uv sync
uv run uvicorn predict:app --reload --port 8000
```

**Fallback using standard Python `venv` (if you don't have `uv`):**

* **Windows (PowerShell):**
  ```powershell
  cd ai-service
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  pip install fastapi uvicorn scikit-learn
  uvicorn predict:app --reload --port 8000
  ```
* **macOS / Linux / WSL:**
  ```bash
  cd ai-service
  python3 -m venv .venv
  source .venv/bin/activate
  pip install fastapi uvicorn scikit-learn
  uvicorn predict:app --reload --port 8000
  ```

### Terminal 2 — Node.js Backend API (Port `5000`)
```bash
cd backend
npm install
node --watch server.js
```
*(If using an older Node.js version that doesn't support `--watch`, run `node server.js`.)*

### Terminal 3 — React Frontend (Port `5173`)
```bash
cd frontend
npm install
npm run dev
```

---

## Testing & Verification

### 1. Browser Dashboard
Open **`http://localhost:5173`** in your browser and click **Simulate Sensor Reading**.
* Moisture `< 30%` triggers the Python AI service to return `irrigate: true`, flipping the **Irrigation Valve** to **ON** and displaying the recommended water volume.
* Moisture `>= 30%` keeps the valve **OFF**.

### 2. API Endpoints (`curl`)

**Fetch latest telemetry:**
```bash
curl http://localhost:5000/api/telemetry/latest
```

**Simulate a dry-soil sensor payload (triggers valve ON):**
```bash
curl -X POST http://localhost:5000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{"fieldId": "ZONE-A1", "moisture": 22, "temperature": 33, "npk": {"n": 40, "p": 25, "k": 30}}'
```

**Test the Python AI service directly:**
```bash
curl -X POST [http://127.0.0.1:8000/predict-irrigation](http://127.0.0.1:8000/predict-irrigation) \
  -H "Content-Type: application/json" \
  -d '{"moisture": 20, "temperature": 34, "rainfall_forecast_mm": 0}'
```

### 3. Verify Database Persistence (`mongosh`)
```bash
mongosh agrosense --eval "db.sensorlogs.find().sort({timestamp: -1}).limit(5)"
```