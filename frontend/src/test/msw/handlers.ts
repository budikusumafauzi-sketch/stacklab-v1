import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', service: 'StackLab Backend', version: '1.0.0' });
  }),
  http.get('/api/v1/health', () => {
    return HttpResponse.json({ status: 'ok', service: 'StackLab Backend', version: '1.0.0' });
  }),
  
  http.post('/api/v1/auth/token', () => {
    return HttpResponse.json({ access_token: 'mock-token', token_type: 'bearer' });
  }),

  http.get('/api/v1/auth/me', () => {
    return HttpResponse.json({ id: '123', email: 'test@example.com', is_active: true, full_name: 'Test User' });
  }),

  http.get('/api/v1/activity*', () => {
    return HttpResponse.json({
      items: [
        { id: 1, title: 'Test Activity', type: 'info', category: 'system', details: {}, created_at: new Date().toISOString(), is_read: false }
      ],
      total: 1,
      page: 1,
      size: 50
    });
  }),
  
  http.post('/api/v1/activity', () => {
    return HttpResponse.json({
      id: Math.floor(Math.random() * 1000),
      title: 'Activity Logged',
      type: 'success',
      category: 'workspace',
      created_at: new Date().toISOString(),
      is_read: false
    });
  }),
  
  // Workspace Mocks
  http.get('/api/v1/workspace', () => {
    return HttpResponse.json([
      { id: 'ws1', name: 'Test WS', is_pinned: false, status: 'active', updated_at: new Date().toISOString() }
    ]);
  }),
  http.post('/api/v1/workspace', () => {
    return HttpResponse.json({ id: 'ws2', name: 'New WS', is_pinned: false, status: 'active', updated_at: new Date().toISOString() });
  }),
  http.put('/api/v1/workspace/:id', () => {
    return HttpResponse.json({ id: 'ws1', name: 'Test WS updated', is_pinned: true, status: 'active', updated_at: new Date().toISOString() });
  }),
  http.delete('/api/v1/workspace/:id', () => {
    return HttpResponse.json({});
  }),
  http.get('/api/v1/workspace/:id/snapshots', () => {
    return HttpResponse.json([
      { id: 'snap1', name: 'Snap 1', version: 1, created_at: new Date().toISOString() }
    ]);
  }),
  http.post('/api/v1/workspace/:id/snapshots', () => {
    return HttpResponse.json({ id: 'snap2' });
  }),
  http.post('/api/v1/workspace/:id/snapshots/:snapId/restore', () => {
    return HttpResponse.json({ id: 'ws1', state: {} });
  }),
  http.get('/api/v1/workspace/:id/export', () => {
    return HttpResponse.json({ export_version: "1.0", checksum: "123" });
  }),
  http.post('/api/v1/workspace/import', () => {
    return HttpResponse.json({ id: 'ws-imported', name: 'Imported' });
  }),
  http.get('/api/v1/workspace/:id/recovery', () => {
    return new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/v1/workspace/:id/recovery', () => {
    return HttpResponse.json({});
  }),
];
