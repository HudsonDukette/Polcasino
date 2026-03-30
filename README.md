# Polcasino — Neon Pool Casino (Frontend + Roulette Server)

This workspace contains a neon-themed frontend (HTML/CSS/JS) and a minimal Python backend used to provide deterministic roulette spin results for the frontend animation.

Quick start (dev):

1. Create and activate a Python virtualenv, install requirements, and run the roulette server:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 scripts/roulette_server.py
```

The server will listen on `http://127.0.0.1:5000` and expose `POST /spin` which returns JSON { resultIndex, number }.

2. Serve the frontend (from project root) with a static server. Example using Python:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser. The frontend will try to call the local roulette server when you click Spin; if the server is not running it will gracefully fall back to a local random spin.

Notes:
- `Play Now` on the dashboard opens the Games tab and selects Roulette.
- Click the avatar (PFP) or username to open the Profile view (the Profile button has been removed from the main nav).
- The server is intentionally tiny and local — it's meant for development and demo only.

If you'd like, I can add a small `Makefile` or `npm` script to run both the static server and Python server concurrently.