"""Authentication endpoints for prototype roles (Astronaut vs Flight Surgeon)."""
import uuid
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_connection, hash_password
from app.schemas.schemas import LoginRequest, LoginResponse, UserOut

router = APIRouter()


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    conn = get_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?",
        (payload.username.strip(),),
    ).fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expected_hash = hash_password(payload.password)
    if user["password_hash"] != expected_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = f"token_{user['role']}_{str(uuid.uuid4())[:16]}"

    user_out = UserOut(
        id=user["id"],
        username=user["username"],
        role=user["role"],
        full_name=user["full_name"],
        astronaut_id=user["astronaut_id"],
    )

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user_out,
    )


@router.get("/auth/me", response_model=UserOut)
def get_me(username: str = "astronaut"):
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserOut(
        id=user["id"],
        username=user["username"],
        role=user["role"],
        full_name=user["full_name"],
        astronaut_id=user["astronaut_id"],
    )
