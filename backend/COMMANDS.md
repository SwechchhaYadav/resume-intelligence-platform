# Backend Command Reference

Quick command reference for common backend operations.

## Installation & Setup

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Setup Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials if needed
```

### Initialize Database
```bash
python init_db.py
```

Expected output:
```
✓ PostgreSQL is running
✓ Database created/exists
✓ Tables created successfully
✓ Database initialization complete!
```

## Running the Backend

### Start Development Server
```bash
python run.py
```

Server will start at `http://localhost:5000`

### Start with Custom Port
```bash
PORT=8000 python run.py
```

### Run in Debug Mode
```bash
export FLASK_DEBUG=1
python run.py
```

### Run in Production Mode
```bash
export FLASK_ENV=production
python run.py
```

## Testing & Verification

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User (Test Account)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Operations

### Access Flask Shell
```bash
export FLASK_APP=app.app
flask shell
```

### Reset Database
```bash
python init_db.py
```

### Backup Database
```bash
pg_dump -U postgres resume_intelligence > backup.sql
```

### Restore Database
```bash
psql -U postgres resume_intelligence < backup.sql
```

### Connect to Database Directly
```bash
psql -U postgres -d resume_intelligence
```

## Python Environment

### Create Virtual Environment
```bash
python -m venv venv
```

### Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Deactivate Virtual Environment
```bash
deactivate
```

## Dependency Management

### Install New Package
```bash
pip install package-name
```

### Update Requirements File
```bash
pip freeze > requirements.txt
```

### Install from Requirements
```bash
pip install -r requirements.txt
```

### List Installed Packages
```bash
pip list
```

## Debugging

### Enable Flask Debug Mode
```bash
export FLASK_DEBUG=1
python run.py
```

### Check Python Version
```bash
python --version
```

### Check PostgreSQL Status
**macOS:**
```bash
brew services list | grep postgresql
```

**Linux:**
```bash
sudo systemctl status postgresql
```

### View Flask Routes
```bash
flask routes
```

## PostgreSQL Management

### Start PostgreSQL Service
**Windows:** Start via Services
**macOS:** `brew services start postgresql`
**Linux:** `sudo systemctl start postgresql`

### Stop PostgreSQL Service
**macOS:** `brew services stop postgresql`
**Linux:** `sudo systemctl stop postgresql`

### Connect to PostgreSQL
```bash
psql -U postgres
```

### Create Database
```sql
CREATE DATABASE resume_intelligence;
```

### List Databases
```sql
\l
```

### List Tables
```sql
\dt
```

### Connect to Database
```sql
\c resume_intelligence
```

### Exit PostgreSQL
```sql
\q
```

## Testing API Endpoints

### For Full API Testing Guide
See `API_TESTING_GUIDE.md`

### Save Token as Environment Variable
```bash
export TOKEN="your_jwt_token_here"
```

### Use Token in Requests
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Upload Resume (Sample)
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@path/to/resume.pdf"
```

## Development Workflow

### Full Setup from Scratch
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env

# 3. Initialize database
python init_db.py

# 4. Start development server
python run.py

# 5. Test in another terminal
curl http://localhost:5000/api/health
```

### Daily Development
```bash
# Start PostgreSQL (if not running)
brew services start postgresql  # macOS

# Activate virtual environment
source venv/bin/activate

# Start Flask
python run.py

# In another terminal, test API
curl http://localhost:5000/api/health
```

## Documentation

### View Documentation
- **Quick Start:** `STARTUP_GUIDE.md`
- **API Testing:** `API_TESTING_GUIDE.md`
- **Database:** `DATABASE_SETUP.md`
- **Full README:** `README.md`
- **Verification:** `VERIFICATION_REPORT.md`

## Useful Tips

### Find Process Using Port 5000
```bash
lsof -i :5000
```

### Kill Process on Port 5000
```bash
kill -9 <PID>
```

### Check File Permissions
```bash
ls -la
```

### Make File Executable
```bash
chmod +x script.py
```

### View Log Output
```bash
tail -f flask.log
```

## Environment Variables

### Set Environment for Current Session
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
export DATABASE_URL=postgresql://...
```

### View All Environment Variables
```bash
env
```

## Common Issues & Fixes

### Issue: Port Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### Issue: Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Database Connection Failed
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

### Issue: Permission Denied
```bash
# Check PostgreSQL user permissions
sudo su - postgres
psql
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
```

## Monitoring

### Check CPU/Memory Usage
```bash
top
```

### Monitor Database Connections
```bash
psql -U postgres resume_intelligence -c \
  "SELECT count(*) FROM pg_stat_activity;"
```

### View Slow Queries
```sql
SELECT query, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## File Management

### List Backend Files
```bash
ls -la
```

### Recursive File List
```bash
ls -R
```

### Count Files
```bash
find . -type f | wc -l
```

### Search for Text in Files
```bash
grep -r "search_term" .
```

## Git Operations (if using version control)

### Initialize Repository
```bash
git init
```

### Add Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "message"
```

### Push to Remote
```bash
git push origin main
```

## Docker (Optional)

### Build Docker Image
```bash
docker build -t resume-api .
```

### Run Docker Container
```bash
docker run -p 5000:5000 resume-api
```

### Using Docker Compose
```bash
docker-compose up
```

## Advanced Debugging

### Python Interactive Debugger
```bash
python -m pdb run.py
```

### Flask Shell with App Context
```bash
flask shell
from app.models.models import User
User.query.all()
```

### Check SQLAlchemy Queries
```python
from sqlalchemy import event
event.listen(Engine, "before_cursor_execute", 
             lambda conn, cursor, statement, parameters, context, executemany: print(statement))
```

## Performance Optimization

### Run Gunicorn (Production)
```bash
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 app.app:app
```

### Profile Application
```bash
pip install flask-profiler
# Add profiler to app
```

### Load Testing
```bash
pip install locust
locust -f locustfile.py
```

## Summary of Key Commands

```bash
# Setup
pip install -r requirements.txt
python init_db.py

# Run
python run.py

# Test
curl http://localhost:5000/api/health

# Database
psql -U postgres resume_intelligence

# Help
# See STARTUP_GUIDE.md for quick start
# See API_TESTING_GUIDE.md for API examples
# See DATABASE_SETUP.md for database help
```

---

For more detailed information, see the documentation files included in the backend directory.
