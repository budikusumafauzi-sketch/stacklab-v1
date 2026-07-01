# Deployment
To deploy StackLab in production:
1. Use Gunicorn with Uvicorn workers for the backend.
2. Build the frontend using `npm run build` and serve via Nginx.
3. Configure CORS and API base URLs.