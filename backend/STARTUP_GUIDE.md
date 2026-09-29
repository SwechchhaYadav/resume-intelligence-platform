# Resume Intelligence Platform - Backend Startup Guide

Complete guide to get the Flask backend running in 5 minutes.

## Quick Start (5 Minutes)

### 1. Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Expected output:
```
Successfully installed Flask-3.0.0 Flask-SQLAlchemy-3.1.1 ...
```

### 3. Configure Database

Copy environment file:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials (if different from defaults):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resume_intelligence
```

### 4. Initialize Database

```bash
python init_db.py
```

Expected output:
```
============================================================
Resume Intelligence Platform - Database Setup
============================================================
Testing PostgreSQL connection...
✓ PostgreSQL is running: PostgreSQL 13.0 on ...

Checking database: resume_intelligence
✓ Database 'resume_intelligence' already exists (or created)

Creating tables...
✓ Tables created successfully
  Tables: users, resumes, analysis_results, career_roadmaps
    - users: 5 columns
    - resumes: 6 columns
    - analysis_results: 8 columns
    - career_roadmaps: 4 columns

Verifying database setup...
✓ All required tables exist
✓ Database verification passed

============================================================
✓ Database initialization complete!
============================================================

Next steps:
1. Verify .env file has correct DATABASE_URL
2. Run the backend: python run.py
3. Test API: http://localhost:5000/api/health
```

### 5. Start the Backend

```bash
python run.py
```

Expected output:
```
Starting Flask app in development mode...
Server running at: http://localhost:5000
API Documentation: http://localhost:5000/api/health
 * Serving Flask app 'app.app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

### 6. Test the API

In a new terminal:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Resume Intelligence Platform API"
}
```

✅ **Backend is running!**

---

## Troubleshooting

### Problem: "Could not connect to server"

**Cause:** PostgreSQL not running

**Solution:**
- **Windows:** Open Services and start PostgreSQL
- **macOS:** `brew services start postgresql`
- **Linux:** `sudo systemctl start postgresql`

### Problem: "database does not exist"

**Cause:** Database not created

**Solution:**
```bash
python init_db.py
```

### Problem: "ModuleNotFoundError"

**Cause:** Dependencies not installed

**Solution:**
```bash
pip install -r requirements.txt
```

### Problem: "Permission denied"

**Cause:** Wrong PostgreSQL user/password

**Solution:** Edit `.env` file with correct credentials

### Problem: Port 5000 already in use

**Cause:** Another application using port 5000

**Solution:** Kill the process or use different port:
```bash
# Find process using port 5000
lsof -i :5000

# Change port in run.py or use:
PORT=5001 python run.py
```

---

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── app.py                    # Main Flask application
│   ├── extensions.py             # Flask extensions (db, jwt, cors)
│   ├── routes/
│   │   ├── __init__.py
│   │   └── api_routes.py         # All API route definitions
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── auth_controller.py    # Authentication logic
│   │   ├── resume_controller.py  # Resume upload/management
│   │   ├── analysis_controller.py# Skill analysis & matching
│   │   └── dashboard_controller.py# Dashboard & roadmap
│   ├── services/
│   │   ├── __init__.py
│   │   ├── resume_service.py     # PDF processing
│   │   ├── skill_extraction_service.py  # Skill detection
│   │   ├── role_matching_service.py    # Role matching logic
│   │   └── career_roadmap_service.py   # Roadmap generation
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py             # SQLAlchemy models
│   ├── utils/
│   │   ├── __init__.py
│   │   └── skills_database.py    # Skills & role profiles
│   ├── config/
│   │   ├── __init__.py
│   │   └── config.py             # Configuration management
│   └── schemas/
│       └── __init__.py
├── uploads/                       # User-uploaded files
├── run.py                        # Entry point
├── init_db.py                    # Database initialization
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
├── .env.example                  # Example environment file
├── README.md                     # Backend documentation
├── API_TESTING_GUIDE.md          # API testing with curl
└── DATABASE_SETUP.md             # Database setup guide
```

---

## File Descriptions

### Core Application Files

- **app.py** - Flask application factory, initializes extensions, registers blueprints
- **extensions.py** - Centralized extension initialization (SQLAlchemy, JWT, CORS)
- **config/config.py** - Environment-based configuration

### Route & Controller Layer

- **routes/api_routes.py** - Defines all API routes and blueprints
- **controllers/** - Business logic for each domain
  - `auth_controller.py` - Register, login, profile
  - `resume_controller.py` - Upload, retrieve, delete resumes
  - `analysis_controller.py` - Skill extraction, role matching
  - `dashboard_controller.py` - Dashboard, history, roadmap

### Service Layer

- **services/resume_service.py** - PDF parsing with pdfplumber
- **services/skill_extraction_service.py** - Detect skills from text
- **services/role_matching_service.py** - Match skills to roles
- **services/career_roadmap_service.py** - Generate learning roadmaps

### Data Layer

- **models/models.py** - SQLAlchemy ORM models
  - User, Resume, AnalysisResult, CareerRoadmap
- **utils/skills_database.py** - Predefined skills & role profiles

---

## Configuration Guide

### Environment Variables (.env)

```
# Flask
FLASK_ENV=development              # development or production
FLASK_APP=app.app
DEBUG=True

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resume_intelligence

# JWT
JWT_SECRET_KEY=your-super-secret-key

# Flask Secret
SECRET_KEY=your-flask-secret-key

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Uploads
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216        # 16MB
```

### Development vs Production

Development:
```
DEBUG=True
FLASK_ENV=development
```

Production:
```
DEBUG=False
FLASK_ENV=production
JWT_SECRET_KEY=<use-strong-random-key>
SECRET_KEY=<use-strong-random-key>
DATABASE_URL=<production-db-url>
```

---

## API Documentation

### Overview

- **Base URL:** `http://localhost:5000/api`
- **Authentication:** JWT tokens
- **Content-Type:** `application/json`

### Main Endpoints

```
Authentication:
  POST   /auth/register        - Register new user
  POST   /auth/login          - Login user
  GET    /auth/profile        - Get user profile
  PUT    /auth/profile        - Update profile

Resume Management:
  POST   /resume/upload       - Upload PDF resume
  GET    /resume              - List user's resumes
  GET    /resume/{id}         - Get resume details
  DELETE /resume/{id}         - Delete resume

Skill Analysis:
  POST   /analysis/extract-skills  - Extract skills from resume
  POST   /analysis/match-role      - Match skills to role
  GET    /analysis/roles           - Get available roles
  GET    /analysis/{id}            - Get analysis result

Dashboard:
  GET    /dashboard           - Get dashboard data
  GET    /dashboard/history   - Get resume history

Career Roadmap:
  POST   /roadmap/generate    - Generate roadmap
  GET    /roadmap/{id}        - Get specific roadmap
  GET    /roadmap             - List all roadmaps
```

For detailed API documentation, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

---

## Database Schema

### Four Main Tables

1. **users** - User accounts with hashed passwords
2. **resumes** - Uploaded PDF files with extracted text
3. **analysis_results** - Skill analysis results for resumes
4. **career_roadmaps** - Generated learning roadmaps

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed schema.

---

## Running Tests

### Test Database Connection

```bash
python init_db.py
```

### Test API Endpoints

```bash
# Test health check
curl http://localhost:5000/api/health

# Test with authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

For comprehensive curl examples, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

---

## Development Workflow

### 1. Start PostgreSQL

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service in Services app
```

### 2. Set Up Virtual Environment (Optional but Recommended)

```bash
# Create
python -m venv venv

# Activate
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Initialize Database

```bash
python init_db.py
```

### 5. Start Backend

```bash
python run.py
```

### 6. Test in Another Terminal

```bash
curl http://localhost:5000/api/health
```

---

## Common Commands

### Database Operations

```bash
# Initialize database
python init_db.py

# Access Flask shell
export FLASK_APP=app.app
flask shell

# Reset database
python init_db.py
```

### Running the App

```bash
# Development mode (with auto-reload)
python run.py

# Production mode
FLASK_ENV=production python run.py

# On specific port
PORT=8000 python run.py
```

### Dependencies

```bash
# Install from requirements
pip install -r requirements.txt

# Generate requirements
pip freeze > requirements.txt
```

---

## Key Technologies

- **Flask 3.0.0** - Web framework
- **SQLAlchemy 2.0** - ORM
- **PostgreSQL** - Database
- **PyJWT 2.8** - JWT authentication
- **bcrypt 4.1** - Password hashing
- **pdfplumber 0.10** - PDF text extraction
- **Flask-CORS 4.0** - CORS support

---

## Performance Notes

- Max file upload: 16MB
- JWT token expiry: 30 days
- Database: PostgreSQL 12+
- Python: 3.8+

---

## Security Checklist

- [ ] Change `SECRET_KEY` in .env
- [ ] Change `JWT_SECRET_KEY` in .env
- [ ] Use HTTPS in production
- [ ] Set `DEBUG=False` in production
- [ ] Use strong PostgreSQL password
- [ ] Enable database backups
- [ ] Restrict CORS origins
- [ ] Monitor error logs

---

## Next Steps

1. ✅ Backend running
2. → Test API endpoints (see API_TESTING_GUIDE.md)
3. → Connect frontend to backend
4. → Deploy to production

---

## Getting Help

### Check Documentation

- API Endpoints: [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)
- Database Setup: [DATABASE_SETUP.md](DATABASE_SETUP.md)
- Full README: [README.md](README.md)

### Debug Mode

Enable detailed logging:

```bash
export FLASK_DEBUG=1
python run.py
```

### Common Issues

See **Troubleshooting** section above for solutions.

---

## Summary

**Total time to get running: ~5 minutes**

```bash
pip install -r requirements.txt
python init_db.py
python run.py
```

That's it! 🚀

The backend will be available at `http://localhost:5000`
