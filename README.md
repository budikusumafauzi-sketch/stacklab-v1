# StackLab

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

StackLab is a professional, interactive learning and simulation platform built for developers, engineers, and students. It provides a comprehensive suite of hands-on technical environments—called "Labs"—designed to test, troubleshoot, and master various computing skills without risking production infrastructure. With its dynamic workspace management and clean, responsive UI, StackLab acts as a centralized sandbox for exploring networking, API requests, database queries, and system administration.

## Features

- **Dashboard**: A centralized command center providing an overview of system status and recent activities.
- **Workspace Management**: Dynamically create and manage isolated workspaces that persist across sessions.
- **Activity Center**: Track all actions, system events, and changes within your environment in real-time.
- **Notifications**: Stay informed with immediate system alerts and updates.
- **Profile**: Manage and view your user profile details.
- **Preferences**: Customize your learning experience and platform behavior.
- **Settings**: System-wide configurations to tailor StackLab to your specific needs.
- **Labs**: Interactive, isolated sandbox environments for specialized technical practice.

## Available Labs

StackLab currently offers the following fully integrated interactive labs:

- **SQL Lab**: A simulated database environment where you can write SQL queries, execute them in real-time, view dynamically generated data tables, visually explore table schemas, and export query results to JSON.
- **JSON Lab**: A robust, specialized editor for formatting, parsing, minifying, and validating complex JSON payloads.
- **API Lab**: A built-in HTTP client for constructing API requests, configuring custom headers and parameters, sending requests, and inspecting detailed response payloads.
- **Linux Lab**: A sandboxed, terminal-like interface emulating a Linux shell to practice standard POSIX commands and bash scripts.
- **Network Lab**: A networking simulation tool designed to test configurations, troubleshoot connectivity, and practice network diagnostics.

## Workspace

The Workspace system is the core of StackLab's isolated environments. The workflow is designed to be persistent and seamless:

1. **Dashboard**: View your existing workspaces or initialize a new one.
2. **Create Workspace**: Define a new isolated environment.
3. **Enter Workspace**: Launch into your configured environment and interact with the available tools and Labs.
4. **Return to Dashboard**: Exit the workspace at any time.
5. **Persistence**: Your workspace remains available and its state is maintained for your next session.

## Technology Stack

### Frontend
- **React 18** (with TypeScript)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Radix UI** (Accessible component primitives)
- **Framer Motion** (Animations)
- **Monaco Editor** (Code editing experience)
- **React Router v6** (Client-side routing)

### Backend
- **Python 3.13+**
- **FastAPI** (High-performance web framework)
- **Uvicorn** (ASGI server)
- **SQLAlchemy 2.0** (ORM)
- **Alembic** (Database migrations)
- **Pydantic V2** (Data validation)

### Database
- **SQLite** (Default local development)

## Project Structure

```text
StackLab/
├── backend/                  # FastAPI Backend Application
│   ├── alembic/              # Database migration scripts
│   ├── app/                  # Main application code
│   │   ├── api/              # API routes and endpoints (v1)
│   │   ├── core/             # Configuration and settings
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic schemas for request/response
│   │   ├── services/         # Business logic and services
│   │   └── utils/            # Helper functions
│   ├── tests/                # Unit and integration tests
│   ├── pyproject.toml        # Python project metadata and dependencies
│   └── alembic.ini           # Alembic configuration
│
└── frontend/                 # React Frontend Application
    ├── public/               # Static assets
    ├── src/                  # Main source code
    │   ├── assets/           # Images, icons, fonts
    │   ├── commands/         # Command registry and keyboard shortcuts
    │   ├── components/       # Reusable UI components
    │   ├── config/           # Application configuration and constants
    │   ├── contexts/         # React Context providers
    │   ├── features/         # Feature-specific implementations
    │   ├── hooks/            # Custom React hooks
    │   ├── layouts/          # Structural page layouts
    │   ├── lib/              # Utility libraries and helpers
    │   ├── pages/            # Route-level React components
    │   ├── providers/        # Global providers (e.g., RouterProvider)
    │   ├── services/         # External services and state managers
    │   ├── styles/           # Global CSS styles
    │   └── types/            # TypeScript type definitions
    ├── package.json          # Node dependencies and scripts
    ├── tailwind.config.js    # Tailwind styling configuration
    └── vite.config.ts        # Vite build configuration
```

## Requirements

Ensure your system meets the following requirements before proceeding:

- **Node.js**: v18.0 or newer
- **npm**: v9.0 or newer
- **Python**: v3.13 or newer
- **pip**: Python package manager
- **Git**: Version control

## Installation

Follow these steps to set up the project on a clean machine.

### 1. Clone the repository

```bash
git clone https://github.com/budikusumafauzi-sketch/stacklab-v1.git
cd stacklab-v1
```

### 2. Backend Setup

Navigate to the backend directory, create a virtual environment, and install the dependencies:

```bash
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -e .[dev]
```

### 3. Configure Backend Environment

Copy the example environment file:

```bash
cp .env.example .env
```

### 4. Run Database Migrations

Apply the latest database schemas using Alembic:

```bash
alembic upgrade head
```

### 5. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install the Node packages:

```bash
cd ../frontend

# Install npm dependencies
npm install
```

### 6. Configure Frontend Environment

Copy the frontend example environment file:

```bash
cp .env.example .env
```

## Environment Variables

### Backend (`backend/.env`)

- `PROJECT_NAME`: The name of the API (Default: `"StackLab API"`).
- `API_V1_STR`: The base path prefix for API v1 endpoints (Default: `"/api/v1"`).
- `ENVIRONMENT`: The runtime environment setting (e.g., `"development"`, `"production"`).
- `BACKEND_CORS_ORIGINS`: A comma-separated list of allowed origins for Cross-Origin Resource Sharing (Default: `"http://localhost:5173,http://localhost:3000"`).

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL`: The base URL pointing to the backend API (Default: `http://localhost:8000/api/v1`).
- `VITE_APP_ENV`: The current frontend environment context (Default: `development`).

## Running the Project

### Start the Backend Server

Ensure your virtual environment is active, then run:

```bash
cd backend
uvicorn app.main:app --reload
```
The backend API will be available at `http://localhost:8000`.

### Start the Frontend Server

In your frontend terminal, run:

```bash
cd frontend
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## Build for Production

### Frontend
To create a highly optimized production build of the frontend, run:

```bash
cd frontend
npm run build
```
This will compile your TypeScript files and output the static assets to the `dist/` directory, which can be served using any static web server (e.g., Nginx, Apache).

### Backend
For a production backend deployment, run the application using a production-ready ASGI server configuration (e.g., Gunicorn with Uvicorn workers):

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

## Project Architecture

StackLab operates on a decoupled client-server architecture:
- **Frontend (React)**: Handles all routing, state management, and user interface rendering locally in the browser. It communicates with the backend exclusively via RESTful HTTP requests using standard JSON payloads.
- **Backend (FastAPI)**: Serves as the central API gateway. It handles business logic, processes incoming requests, interacts with the database via SQLAlchemy, and returns structured JSON responses. Cross-Origin Resource Sharing (CORS) is configured on the backend to securely accept requests from the frontend origin.

## API

The backend exposes the following active API groups under the `/api/v1` prefix:

- `/api/v1/workspace`: Endpoints to create, read, update, and delete user workspaces.
- `/api/v1/activity`: Endpoints to fetch user activity logs and recent actions for the dashboard.
- `/api/health` & `/api/v1/health`: Basic health check endpoints indicating service status and version.

## Troubleshooting

- **Backend won't start (Missing Modules)**
  *Cause*: Dependencies aren't installed or virtual environment isn't active.
  *Fix*: Ensure you ran `.\.venv\Scripts\activate` (Windows) and `pip install -e .` in the backend directory.

- **Port 8000/5173 already in use**
  *Cause*: Another application is occupying the default port.
  *Fix*: Pass a different port to Uvicorn (`--port 8001`) or Vite (`--port 3000`).

- **CORS errors**
  *Cause*: The frontend is attempting to access the backend from an unauthorized origin.
  *Fix*: Ensure your frontend URL (e.g., `http://localhost:5173`) is included in the `BACKEND_CORS_ORIGINS` variable in `backend/.env`.

- **npm install failures**
  *Cause*: Outdated Node version or conflicting cached packages.
  *Fix*: Ensure Node v18+ is installed. Clear the cache with `npm cache clean --force`, delete `node_modules` and `package-lock.json`, and run `npm install` again.

- **Database Migration Errors**
  *Cause*: Alembic versions are out of sync or the database file is locked.
  *Fix*: Delete the local `stacklab.db` (if in development) and re-run `alembic upgrade head`.

## Deployment

1. **Frontend**: Deploy the `dist/` directory to standard hosting providers like Vercel, Netlify, Cloudflare Pages, or AWS S3.
2. **Backend**: Containerize the FastAPI application using Docker, or deploy directly to platforms like Render, Railway, or AWS EC2 using Gunicorn.
3. **Database**: Use a managed SQLite instance or migrate to a PostgreSQL environment depending on production requirements.

## Project Status

Current Version: v1.0

Status: Completed

This project is considered feature-complete for its intended scope as a professional full-stack portfolio application. Future updates will focus only on maintenance, bug fixes, and minor improvements without expanding the original project scope.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Browser Support

- Google Chrome (Recommended)
- Microsoft Edge
- Mozilla Firefox

Maintenance: Active

## Author

Fauzi Budikusuma

AI & Full Stack Engineer

GitHub: https://github.com/budikusumafauzi-sketch
