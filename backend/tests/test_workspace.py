import pytest
from app.models.user import User
from app.core.security import get_password_hash
import json

@pytest.fixture
async def auth_token(client, db_session):
    hashed_password = get_password_hash("password123")
    user = User(email="test_ws@example.com", password_hash=hashed_password)
    db_session.add(user)
    db_session.commit()
    
    login_res = await client.post(
        "/api/v1/auth/login",
        data={"username": "test_ws@example.com", "password": "password123"}
    )
    return login_res.json()["access_token"]

@pytest.mark.asyncio
async def test_workspace_crud(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # 1. Create Workspace
    res = await client.post(
        "/api/v1/workspace",
        json={"name": "Test Env", "state": {"file": "const x = 1;"}},
        headers=headers
    )
    assert res.status_code == 200
    ws = res.json()
    assert ws["name"] == "Test Env"
    ws_id = ws["id"]

    # 2. Get Workspace
    res = await client.get(f"/api/v1/workspace/{ws_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["id"] == ws_id
    
    # 3. Update Workspace
    res = await client.put(
        f"/api/v1/workspace/{ws_id}",
        json={"name": "Test Env Updated", "version": 1},
        headers=headers
    )
    assert res.status_code == 200
    assert res.json()["name"] == "Test Env Updated"
    assert res.json()["version"] == 2
    
    # 4. Update Workspace Conflict (Optimistic Locking)
    res = await client.put(
        f"/api/v1/workspace/{ws_id}",
        json={"name": "Conflict", "version": 1},
        headers=headers
    )
    assert res.status_code == 409
    
    # 5. Get Workspaces List
    res = await client.get("/api/v1/workspace", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    
    # 6. Delete
    res = await client.delete(f"/api/v1/workspace/{ws_id}", headers=headers)
    assert res.status_code == 200
    
    # Verify Soft Delete
    res = await client.get(f"/api/v1/workspace/{ws_id}", headers=headers)
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_workspace_snapshot_and_recovery(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    res = await client.post(
        "/api/v1/workspace",
        json={"name": "Test Snapshots", "state": {"val": 1}},
        headers=headers
    )
    ws_id = res.json()["id"]
    
    # 1. Create Snapshot
    res = await client.post(
        f"/api/v1/workspace/{ws_id}/snapshots",
        json={"state": {"val": 1}},
        headers=headers
    )
    assert res.status_code == 200
    snap_id = res.json()["id"]
    
    # 2. List Snapshots
    res = await client.get(f"/api/v1/workspace/{ws_id}/snapshots", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 1
    
    # 3. Restore Snapshot
    res = await client.post(f"/api/v1/workspace/{ws_id}/snapshots/{snap_id}/restore", headers=headers)
    assert res.status_code == 200
    assert res.json()["state"] == {"val": 1}
    assert res.json()["version"] == 2
    
    # 4. Save Recovery
    res = await client.post(
        f"/api/v1/workspace/{ws_id}/recovery",
        json={"state": {"val": "dirty"}},
        headers=headers
    )
    assert res.status_code == 200
    
    # 5. Get Recovery
    res = await client.get(f"/api/v1/workspace/{ws_id}/recovery", headers=headers)
    assert res.status_code == 200
    assert res.json()["state"] == {"val": "dirty"}
    
    # 6. Clear Recovery
    res = await client.delete(f"/api/v1/workspace/{ws_id}/recovery", headers=headers)
    assert res.status_code == 200
    
    res = await client.get(f"/api/v1/workspace/{ws_id}/recovery", headers=headers)
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_export_import(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    res = await client.post(
        "/api/v1/workspace",
        json={"name": "Export Me", "state": {"key": "val"}},
        headers=headers
    )
    ws_id = res.json()["id"]
    
    # 1. Export
    res = await client.get(f"/api/v1/workspace/{ws_id}/export", headers=headers)
    assert res.status_code == 200
    export_payload = res.json()
    assert "checksum" in export_payload
    
    # 2. Import
    res = await client.post("/api/v1/workspace/import", json=export_payload, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Export Me"
    assert res.json()["id"] != ws_id # new id generated

@pytest.mark.asyncio
async def test_export_import_compression_and_extension(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Register dummy extension plugin
    # 1. Create Workspace
    create_res = await client.post(
        "/api/v1/workspace",
        json={"name": "Compression Test"},
        headers=headers
    )
    assert create_res.status_code == 200
    ws_id = create_res.json()["id"]

    # 2. Add Snapshot
    await client.post(
        f"/api/v1/workspace/{ws_id}/snapshots",
        json={"state": {"key": "val"}},
        headers=headers
    )

    # 3. Export Workspace (Tests Compression)
    export_res = await client.get(
        f"/api/v1/workspace/{ws_id}/export",
        headers=headers
    )
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert "compressed_payload" in export_data
    assert export_data["compressed_payload"] is not None

    # 4. Import Workspace (Tests Decompression)
    import_res = await client.post(
        "/api/v1/workspace/import",
        json=export_data,
        headers=headers
    )
    assert import_res.status_code == 200
    imported_ws = import_res.json()
    assert imported_ws["name"] == "Compression Test"
    assert imported_ws["id"] != ws_id # new UUID
