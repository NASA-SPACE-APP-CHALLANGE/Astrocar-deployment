"""Astronaut profiles and baseline management endpoints."""
from fastapi import APIRouter, HTTPException
from typing import Optional
from app.core.database import get_connection
from app.schemas.schemas import AstronautOut, AstronautUpdate, AstronautListResponse

router = APIRouter()


@router.get("/astronauts", response_model=AstronautListResponse)
def list_astronauts():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM astronauts ORDER BY astronaut_id ASC").fetchall()
    conn.close()

    astronauts = [dict(r) for r in rows]
    return AstronautListResponse(total=len(astronauts), astronauts=astronauts)


@router.get("/astronauts/{astronaut_id}", response_model=AstronautOut)
def get_astronaut(astronaut_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM astronauts WHERE astronaut_id = ?", (astronaut_id,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Astronaut '{astronaut_id}' not found")
    return dict(row)


@router.put("/astronauts/{astronaut_id}", response_model=AstronautOut)
def update_astronaut(astronaut_id: str, payload: AstronautUpdate):
    conn = get_connection()
    existing = conn.execute("SELECT * FROM astronauts WHERE astronaut_id = ?", (astronaut_id,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Astronaut '{astronaut_id}' not found")

    fields = []
    params = []
    data = payload.dict(exclude_unset=True)

    for k, v in data.items():
        if v is not None:
            fields.append(f"{k} = ?")
            params.append(v)

    if fields:
        params.append(astronaut_id)
        conn.execute(f"UPDATE astronauts SET {', '.join(fields)} WHERE astronaut_id = ?", params)
        conn.commit()

    updated = conn.execute("SELECT * FROM astronauts WHERE astronaut_id = ?", (astronaut_id,)).fetchone()
    conn.close()
    return dict(updated)
