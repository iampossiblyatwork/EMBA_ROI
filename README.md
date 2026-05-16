# Michigan State EMBA ROI Calculator

A Flask + React single-page app that estimates the financial return of pursuing
Michigan State University's Executive MBA program.

## Features

- Year-by-year projection of pre- vs. post-MBA after-tax income, tuition cost,
  and cumulative net return.
- Interactive Recharts line chart with a break-even marker.
- 2024 federal tax brackets for Single, Married Filing Jointly, and Head of
  Household filing statuses.
- Scenario A / B side-by-side comparison.
- Shareable URLs — inputs are encoded in the query string.
- Live recalculation (debounced) — no page reloads.

## Architecture

```
backend/      Flask app factory + JSON API (POST /api/calculate)
  tax.py        Filing-status-aware tax brackets
  calculator.py Pure-Python projection (no pandas / numpy)
  schemas.py    Input/output dataclasses + validation
  api.py        Blueprint
frontend/     React + Vite + Tailwind SPA (Recharts for the chart)
tests/        pytest unit + API tests
```

## Local development

### Backend (Python 3.10+)

```bash
pip install -e ".[dev]"
pytest                          # run the test suite
flask --app backend run --debug # serve API on http://localhost:5000
```

### Frontend (Node 20+)

```bash
cd frontend
npm install
npm run dev                     # Vite on http://localhost:5173, proxies /api to :5000
```

### Production-equivalent (single port)

```bash
cd frontend && npm install && npm run build && cd ..
flask --app backend run         # serves the built SPA from /
```

## Production

```bash
docker build -t emba-roi .
docker run --rm -p 8000:8000 emba-roi
```

Or with gunicorn directly:

```bash
gunicorn -w 2 -b 0.0.0.0:8000 'backend:create_app()'
```

The included `Procfile` works for Render, Railway, Fly, Heroku-style deploys.

## Health check

`GET /healthz` returns `{"status": "ok"}` for container/load-balancer probes.
