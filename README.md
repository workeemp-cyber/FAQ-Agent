# FAQ Support Bot

## Overview

FAQ Support Bot is a customer-support application that uses retrieval-augmented generation (RAG) to answer frequently asked questions. It maintains conversation context and identifies low-confidence matches for review through a staff dashboard. Staff can review and update the status of queries from the dashboard.

## Technology Stack

- **Backend:** FastAPI and Uvicorn
- **Retrieval and orchestration:** LangChain
- **Vector database:** ChromaDB
- **Language model provider:** Groq (`openai/gpt-oss-20b`)
- **Embedding model:** Ollama (`nomic-embed-text`)

## Prerequisites

Before running the application, install the following:

- Python 3.12
- [Ollama](https://ollama.com)
- A Groq API key, available from the [Groq Console](https://console.groq.com)

Python 3.12 is recommended for this project to ensure compatibility with the project's dependencies on Windows.

## Setup and Installation

### 1. Download the project

Clone the repository:

```powershell
git clone YOUR_GITHUB_REPOSITORY_URL
cd faq-support-bot
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the repository's URL. Alternatively, download the repository as a ZIP file from GitHub, extract it, and open a terminal in the project directory.

### 2. Install the embedding model

Open a terminal and run:

```powershell
ollama pull nomic-embed-text
```

Ensure Ollama is running before starting the application. The optional `llama3` model can also be downloaded if required for your local setup:

```powershell
ollama pull llama3
```

### 3. Create and activate a virtual environment

From the project directory, run:

```powershell
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell prevents script activation, run the following command in the same terminal and then activate the environment again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

### 4. Install dependencies

With the virtual environment activated, run:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 5. Configure environment variables

Create a local `.env` file from the example configuration:

```powershell
Copy-Item .env.example .env
```

Open `.env` and set the required values, including your Groq API key in `GROQ_API_KEY`. Set `COMPANY_NAME` to the name of your organization or project as appropriate. Do not commit API keys or other secrets to the repository.

## Running the Application

Ensure that Ollama is running and that the virtual environment is activated. Start the application with:

```powershell
python -m uvicorn app.main:app --reload
```

When the server starts, open the following addresses in your browser:

- **Chat interface:** http://127.0.0.1:8000
- **Staff dashboard:** http://127.0.0.1:8000/dashboard

Keep the terminal open while using the application. To stop the server, press `Ctrl+C` in the terminal.

## Customization

- **FAQ content:** Update the sample questions and answers in `data/faqs.json`.
- **Company name and credentials:** Update the appropriate values in `.env`.
- **Suggested questions:** Edit `static/index.html`.
- **Escalation threshold:** Adjust `ESCALATE_DISTANCE` in the configuration to change how readily low-confidence matches are flagged for review.

After changing the FAQ content, delete the `chroma_db` directory and restart the application so the vector data can be rebuilt from the updated FAQs.

## Troubleshooting

- **Python version:** Confirm that Python 3.12 is installed and available with `py -3.12 --version`.
- **Dependency installation errors:** Activate the virtual environment and rerun `python -m pip install -r requirements.txt`. If an error persists, review the package-specific error message and Python compatibility requirements.
- **Ollama or embedding errors:** Confirm that Ollama is installed, running, and that `nomic-embed-text` has been downloaded.
- **Configuration errors:** Confirm that `.env` exists and contains the required values, including `GROQ_API_KEY`.
- **Port conflicts:** If port 8000 is already in use, stop the other process or configure a different port before starting the application.

## Project Structure

```text
faq-support-bot/
├── app/
│   ├── main.py
│   ├── agent.py
│   ├── rag.py
│   ├── store.py
│   └── config.py
├── data/
│   ├── faqs.json
│   └── queries.json
├── static/
│   ├── index.html
│   └── dashboard.html
├── chroma_db/
├── requirements.txt
└── README.md
```

Additional static assets and configuration files may also be present in the repository.
