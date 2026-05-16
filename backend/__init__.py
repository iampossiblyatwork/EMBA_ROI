from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, send_from_directory

from .api import api_bp

_FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder=str(_FRONTEND_DIST),
        static_url_path="",
    )
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.get("/healthz")
    def healthz():
        return {"status": "ok"}, 200

    @app.get("/")
    def index():
        index_path = _FRONTEND_DIST / "index.html"
        if not index_path.exists():
            return (
                "Frontend has not been built yet. "
                "Run `cd frontend && npm install && npm run build`.",
                503,
            )
        return send_from_directory(str(_FRONTEND_DIST), "index.html")

    @app.get("/<path:path>")
    def spa_fallback(path: str):
        target = _FRONTEND_DIST / path
        if target.is_file():
            return send_from_directory(str(_FRONTEND_DIST), path)
        return send_from_directory(str(_FRONTEND_DIST), "index.html")

    return app


if os.environ.get("FLASK_RUN_FROM_CLI"):
    app = create_app()
