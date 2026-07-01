import pytest
from app.models.user import User
from app.core.security import get_password_hash

@pytest.mark.asyncio
async def test_create_and_read_activity(client, db_session):
    # Setup user
    hashed_password = get_password_hash("password123")
    user = User(email="test_act@example.com", password_hash=hashed_password)
    db_session.add(user)
    db_session.commit()

    login_res = await client.post(
        "/api/v1/auth/login",
        data={"username": "test_act@example.com", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create activity
    create_res = await client.post(
        "/api/v1/activity/",
        json={"title": "Test Activity", "type": "INFO", "category": "System", "metadata": {}},
        headers=headers
    )
    assert create_res.status_code == 200

    # Read activities
    read_res = await client.get("/api/v1/activity/", headers=headers)
    assert read_res.status_code == 200
    data = read_res.json()
    assert data["total"] >= 1
    assert data["items"][0]["title"] == "Test Activity"

@pytest.mark.asyncio
async def test_mark_all_as_read(client, db_session):
    # Setup user
    hashed_password = get_password_hash("password123")
    user = User(email="test_act_read@example.com", password_hash=hashed_password)
    db_session.add(user)
    db_session.commit()

    login_res = await client.post(
        "/api/v1/auth/login",
        data={"username": "test_act_read@example.com", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    await client.post(
        "/api/v1/activity/",
        json={"title": "Test 1", "type": "INFO", "category": "System", "metadata": {}},
        headers=headers
    )

    read_res = await client.patch("/api/v1/activity/read-all", headers=headers)
    assert read_res.status_code == 200
    assert "updated" in read_res.json()
