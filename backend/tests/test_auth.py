import pytest
from app.models.user import User
from app.core.security import get_password_hash

@pytest.mark.asyncio
async def test_register_user(client, db_session):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_login_user(client, db_session):
    # Setup user
    hashed_password = get_password_hash("password123")
    user = User(email="login@example.com", password_hash=hashed_password)
    db_session.add(user)
    db_session.commit()

    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


