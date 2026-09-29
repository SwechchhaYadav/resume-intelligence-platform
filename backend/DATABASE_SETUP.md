# Database Setup Guide

Complete instructions for setting up PostgreSQL database for Resume Intelligence Platform.

## Prerequisites

- PostgreSQL 12 or higher installed
- `psycopg2-binary` Python package (included in requirements.txt)
- Python 3.8+

## Option 1: Automatic Database Setup (Recommended)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Environment

Copy and edit `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/resume_intelligence
```

### Step 3: Run Database Initialization

```bash
python init_db.py
```

This script will:
1. Create the database if it doesn't exist
2. Create all tables automatically
3. Set up proper indexes and constraints

Expected output:
```
Starting database initialization...

1. Creating database...
Creating database: resume_intelligence
Database 'resume_intelligence' created successfully!

2. Creating tables...
All tables created successfully!

✓ Database initialization complete!

Next steps:
1. Set up your .env file with proper credentials
2. Run: python run.py
```

---

## Option 2: Manual Database Setup

### Step 1: Start PostgreSQL

**Windows:**
```bash
# PostgreSQL should start automatically
# Or start via Services
```

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Step 2: Connect to PostgreSQL

```bash
psql -U postgres
```

When prompted, enter your PostgreSQL password.

### Step 3: Create Database

```sql
CREATE DATABASE resume_intelligence;
```

### Step 4: Create Tables

```sql
-- Connect to the new database
\c resume_intelligence

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Create Resumes table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    extracted_text TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- Create Analysis Results table
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    target_role VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    matched_skills JSON NOT NULL DEFAULT '[]'::json,
    missing_skills JSON NOT NULL DEFAULT '[]'::json,
    recommendations JSON NOT NULL DEFAULT '[]'::json,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analysis_results_resume_id ON analysis_results(resume_id);

-- Create Career Roadmaps table
CREATE TABLE career_roadmaps (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER NOT NULL UNIQUE REFERENCES analysis_results(id) ON DELETE CASCADE,
    roadmap_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_career_roadmaps_analysis_id ON career_roadmaps(analysis_id);
```

### Step 5: Verify Tables

```sql
\dt
```

You should see:
```
               List of relations
 Schema |       Name       | Type  | Owner
--------+------------------+-------+----------
 public | analysis_results | table | postgres
 public | career_roadmaps  | table | postgres
 public | resumes          | table | postgres
 public | users            | table | postgres
(4 rows)
```

Exit PostgreSQL:
```sql
\q
```

---

## Option 3: Docker Setup

### Using Docker Compose

Create `docker-compose.yml` in backend directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: resume_intelligence_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: resume_intelligence
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  flask_app:
    build: .
    container_name: resume_intelligence_api
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/resume_intelligence
      FLASK_ENV: development
      FLASK_APP: app.app
    ports:
      - "5000:5000"
    volumes:
      - .:/app
    command: python run.py

volumes:
  postgres_data:
```

Create `Dockerfile` in backend directory:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "run.py"]
```

Start services:

```bash
docker-compose up -d
```

Check status:

```bash
docker-compose ps
```

Stop services:

```bash
docker-compose down
```

---

## Verify Database Connection

### Method 1: Using Flask Shell

```bash
cd backend
export FLASK_APP=app.app
flask shell
```

Then in Python:
```python
from app.app import create_app
from app.extensions import db
app = create_app()

with app.app_context():
    result = db.session.execute(db.text("SELECT 1"))
    print("Database connection successful!")
```

### Method 2: Using Python Script

Create `test_db.py`:

```python
import os
from dotenv import load_dotenv
from app.app import create_app
from app.extensions import db

load_dotenv()

try:
    app = create_app()
    with app.app_context():
        # Test connection
        db.session.execute(db.text("SELECT 1"))
        
        # Count tables
        result = db.session.execute(db.text(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"
        ))
        table_count = result.scalar()
        
        print(f"✓ Database connection successful!")
        print(f"✓ Tables created: {table_count}")
        
except Exception as e:
    print(f"✗ Database connection failed: {str(e)}")
    exit(1)
```

Run:
```bash
python test_db.py
```

---

## Database Backup and Restore

### Backup Database

```bash
# Full database dump
pg_dump -U postgres resume_intelligence > backup.sql

# Compressed backup
pg_dump -U postgres resume_intelligence | gzip > backup.sql.gz
```

### Restore Database

```bash
# Drop existing database (if needed)
dropdb -U postgres resume_intelligence

# Create new database
createdb -U postgres resume_intelligence

# Restore from backup
psql -U postgres resume_intelligence < backup.sql

# Or from compressed
gunzip -c backup.sql.gz | psql -U postgres resume_intelligence
```

---

## Database Maintenance

### Check Database Size

```bash
psql -U postgres -d resume_intelligence -c "
SELECT pg_size_pretty(pg_database_size(current_database()));
"
```

### Check Table Sizes

```bash
psql -U postgres -d resume_intelligence -c "
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Vacuum and Analyze (Optimization)

```bash
psql -U postgres -d resume_intelligence -c "VACUUM ANALYZE;"
```

### View Table Indexes

```bash
psql -U postgres -d resume_intelligence -c "
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
"
```

---

## Troubleshooting

### Error: "could not connect to server"

**Cause:** PostgreSQL not running

**Solution:**
- Windows: Check PostgreSQL service in Services
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### Error: "database does not exist"

**Cause:** Database not created

**Solution:** Run `python init_db.py` or create manually with SQL

### Error: "connection timeout"

**Cause:** PostgreSQL not listening on correct port

**Solution:** Check PostgreSQL config or modify DATABASE_URL

### Error: "password authentication failed"

**Cause:** Wrong password in DATABASE_URL

**Solution:** Verify credentials in .env file

### Error: "permission denied for schema public"

**Cause:** PostgreSQL user doesn't have permissions

**Solution:** Grant permissions:
```sql
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
```

---

## Performance Optimization

### 1. Connection Pooling

Update `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_intelligence?sslmode=require
```

### 2. Enable Slow Query Logging

In PostgreSQL config (`postgresql.conf`):
```
log_min_duration_statement = 1000  # Log queries slower than 1 second
```

### 3. Create Indexes for Frequently Queried Fields

Already included in schema:
- `idx_users_email` - for login queries
- `idx_resumes_user_id` - for fetching user's resumes
- `idx_analysis_results_resume_id` - for analysis lookups
- `idx_career_roadmaps_analysis_id` - for roadmap lookups

### 4. Archiving Old Data

```sql
-- Archive analyses older than 1 year
CREATE TABLE analysis_results_archive AS
SELECT * FROM analysis_results
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM analysis_results
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## Migration to Production

### 1. Use Managed PostgreSQL Service

- AWS RDS PostgreSQL
- Google Cloud SQL
- Azure Database for PostgreSQL
- DigitalOcean Managed PostgreSQL

### 2. Update Connection String

```
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/resume_intelligence
```

### 3. Enable SSL

```
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/resume_intelligence?sslmode=require
```

### 4. Set Up Automated Backups

Most managed services include automated backups. Verify settings:
- Backup frequency: Daily
- Retention: 30 days minimum
- Point-in-time recovery enabled

### 5. Monitor Performance

```bash
# Monitor active connections
psql -U postgres -d resume_intelligence -c "
SELECT pid, usename, application_name, state
FROM pg_stat_activity;
"
```

---

## Testing Database Operations

### Test User Registration

```sql
-- Check if user is created correctly
SELECT * FROM users WHERE email = 'test@example.com';

-- Verify password hash length
SELECT email, LENGTH(password_hash) as hash_length FROM users;
```

### Test Resume Upload

```sql
-- Check resumes for user
SELECT r.id, r.filename, r.uploaded_at, LENGTH(r.extracted_text) as text_length
FROM resumes r
WHERE r.user_id = 1;
```

### Test Analysis Results

```sql
-- Check analysis results
SELECT a.id, a.target_role, a.score, a.matched_skills, a.missing_skills
FROM analysis_results a
WHERE a.resume_id = 1;
```

---

## Database Schema Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ full_name       │
│ email (UNIQUE)  │
│ password_hash   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ (1:N)
         │
         ▼
┌─────────────────┐
│    resumes      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │──────┐
│ filename        │      │
│ file_path       │      │
│ extracted_text  │      │
│ uploaded_at     │      │
└────────┬────────┘      │
         │               │
         │ (1:N)         │
         │               │
         ▼               │
┌──────────────────────┐ │
│ analysis_results     │ │
├──────────────────────┤ │
│ id (PK)              │ │
│ resume_id (FK)───────┤─┘
│ target_role          │
│ score                │
│ matched_skills (JSON)│
│ missing_skills (JSON)│
│ recommendations (JSON)
│ created_at           │
└──────────┬───────────┘
           │
           │ (1:1)
           │
           ▼
┌──────────────────────┐
│ career_roadmaps      │
├──────────────────────┤
│ id (PK)              │
│ analysis_id (FK)     │
│ roadmap_data (JSON)  │
│ created_at           │
└──────────────────────┘
```

---

## Quick Reference

### Start Backend with Fresh Database

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up .env file
cp .env.example .env

# 3. Initialize database
python init_db.py

# 4. Start server
python run.py
```

### Connect via psql

```bash
psql -U postgres -d resume_intelligence
```

### Run Flask Shell

```bash
flask shell
```

### Reset Database

```bash
python init_db.py  # Recreates all tables
```

---

## Next Steps

1. ✓ PostgreSQL installed and running
2. ✓ Database created
3. ✓ Tables set up
4. → Run `python run.py`
5. → Test API endpoints from API_TESTING_GUIDE.md
