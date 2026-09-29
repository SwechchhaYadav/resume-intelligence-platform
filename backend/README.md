# Resume Intelligence Platform - Backend

A production-grade Flask backend for the Resume Intelligence Platform. This API provides resume processing, skill extraction, role matching, and career roadmap generation.

## Features

✅ **User Authentication**
- JWT-based authentication
- User registration and login
- Profile management
- Password hashing with bcrypt

✅ **Resume Processing**
- PDF upload and storage
- Text extraction from resumes
- Metadata extraction

✅ **Skill Detection**
- Automatic skill extraction from resume text
- 50+ predefined skills database
- Skill categorization by type

✅ **Role Matching**
- Match skills against 6 job roles
- Calculate skill fit scores
- Identify skill gaps
- Generate personalized recommendations

✅ **Career Roadmaps**
- 6-month learning roadmaps
- Skill prioritization
- Estimated learning durations
- Resource recommendations

✅ **Dashboard Analytics**
- Resume score calculation
- Skill distribution analysis
- Recent analysis history
- Overall profile assessment

## Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (PyJWT)
- **Security**: bcrypt
- **PDF Processing**: pdfplumber
- **CORS**: Flask-CORS

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip

## Installation

### 1. Clone the Repository

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_intelligence

# JWT
JWT_SECRET_KEY=your-secure-secret-key

# Flask
SECRET_KEY=your-flask-secret-key

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 5. Set Up PostgreSQL Database

**Option A: Using init_db.py (Recommended)**

```bash
python init_db.py
```

**Option B: Manual Setup**

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE resume_intelligence;

-- Connect to new database
\c resume_intelligence

-- Tables will be created automatically on first run
```

### 6. Run the Application

```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 201
{
  "message": "User registered successfully",
  "user": { ... },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 200
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer {access_token}

Response: 200
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-06-07T10:00:00"
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "Jane Doe"
}

Response: 200
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Resume Upload

#### Upload Resume
```
POST /api/resume/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

file: <PDF file>

Response: 201
{
  "message": "Resume uploaded successfully",
  "resume": {
    "id": 1,
    "filename": "resume.pdf",
    "uploaded_at": "2026-06-07T10:00:00"
  },
  "detected_skills": ["Python", "JavaScript", "React", ...],
  "skill_count": 12
}
```

#### Get All Resumes
```
GET /api/resume
Authorization: Bearer {access_token}

Response: 200
{
  "resumes": [ ... ],
  "total": 3
}
```

#### Get Specific Resume
```
GET /api/resume/{resume_id}
Authorization: Bearer {access_token}

Response: 200
{
  "resume": { ... },
  "extracted_text": "...",
  "detected_skills": [ ... ],
  "skill_categories": { ... }
}
```

#### Delete Resume
```
DELETE /api/resume/{resume_id}
Authorization: Bearer {access_token}

Response: 200
{
  "message": "Resume deleted successfully"
}
```

### Skill Analysis

#### Extract Skills
```
POST /api/analysis/extract-skills
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "resume_id": 1
}

Response: 200
{
  "skills": ["Python", "JavaScript", "React", ...],
  "skill_count": 12,
  "categories": {
    "Programming Languages": ["Python", "JavaScript"],
    "Frontend": ["React", "TypeScript"],
    ...
  },
  "metadata": {
    "has_email": true,
    "has_phone": true,
    "has_github": true
  }
}
```

#### Match Role
```
POST /api/analysis/match-role
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "resume_id": 1,
  "role": "Software Engineer"
}

Response: 201
{
  "analysis_id": 1,
  "target_role": "Software Engineer",
  "score": 78,
  "match_percentage": "78%",
  "matched_skills": ["Python", "JavaScript", "React"],
  "missing_skills": ["Kubernetes", "Docker"],
  "matched_count": 3,
  "missing_count": 2,
  "recommendations": [ ... ]
}
```

#### Get Available Roles
```
GET /api/analysis/roles
Authorization: Bearer {access_token}

Response: 200
{
  "roles": {
    "Software Engineer": { ... },
    "Frontend Developer": { ... },
    ...
  },
  "total": 6
}
```

### Dashboard

#### Get Dashboard
```
GET /api/dashboard
Authorization: Bearer {access_token}

Response: 200
{
  "resume_score": 82,
  "role_fit": 78,
  "skills_found": 12,
  "missing_skills": 4,
  "target_role": "Software Engineer",
  "recommendations": [ ... ],
  "recent_analyses": [ ... ],
  "skill_distribution": { ... }
}
```

#### Get Resume History
```
GET /api/dashboard/history
Authorization: Bearer {access_token}

Response: 200
{
  "history": [
    {
      "resume": { ... },
      "analyses": [ ... ],
      "skill_count": 12
    }
  ],
  "total_resumes": 3
}
```

### Career Roadmap

#### Generate Roadmap
```
POST /api/roadmap/generate
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "analysis_id": 1
}

Response: 201
{
  "message": "Roadmap generated successfully",
  "roadmap": {
    "id": 1,
    "analysis_id": 1,
    "roadmap_data": {
      "months": [
        {
          "month": 1,
          "title": "Foundation Building",
          "goals": [ ... ],
          "milestones": [ ... ],
          "resources": [ ... ]
        },
        ...
      ]
    },
    "created_at": "2026-06-07T10:00:00"
  }
}
```

#### Get Roadmap
```
GET /api/roadmap/{roadmap_id}
Authorization: Bearer {access_token}

Response: 200
{
  "roadmap": { ... }
}
```

#### Get All Roadmaps
```
GET /api/roadmap
Authorization: Bearer {access_token}

Response: 200
{
  "roadmaps": [ ... ],
  "total": 3
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  extracted_text TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analysis Results Table
```sql
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER NOT NULL REFERENCES resumes(id),
  target_role VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  matched_skills JSON NOT NULL,
  missing_skills JSON NOT NULL,
  recommendations JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Career Roadmaps Table
```sql
CREATE TABLE career_roadmaps (
  id SERIAL PRIMARY KEY,
  analysis_id INTEGER NOT NULL UNIQUE REFERENCES analysis_results(id),
  roadmap_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Skill Database

The backend includes 50+ predefined skills:

**Programming Languages**: C, C++, Java, Python, JavaScript, TypeScript, Bash

**Frontend**: React, Vue.js, Angular, Next.js, HTML, CSS, SCSS, Tailwind CSS

**Backend**: Node.js, Express, Flask, Django, Spring Boot, REST API, GraphQL

**Databases**: SQL, PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch

**DevOps**: Docker, Kubernetes, AWS, Azure, Google Cloud, CI/CD, Jenkins, Git

**ML/AI**: Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy

## Available Roles

1. **Software Engineer** - Full-stack development
2. **Frontend Developer** - Web UI development
3. **Backend Developer** - Server-side development
4. **Data Analyst** - Data analysis and visualization
5. **Data Scientist** - ML and advanced analytics
6. **Machine Learning Engineer** - ML systems development

Each role has specific required skills and weightings.

## Troubleshooting

### PostgreSQL Connection Error
```
Error: could not connect to server: No such file or directory
```

**Solution**: 
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials

### JWT Token Expired
```
Error: Token has expired
```

**Solution**: 
- Request a new token by logging in again
- Tokens are valid for 30 days by default

### PDF Upload Error
```
Error: Invalid PDF file
```

**Solution**:
- Ensure file is a valid PDF
- Check file size (max 16MB)
- Try re-exporting the PDF

### Port Already in Use
```
Error: Address already in use
```

**Solution**:
```bash
# Change port in run.py or use:
python run.py --port 5001
```

## Performance Optimization

1. **Resume Processing**: Large PDFs (50+ pages) may take longer
2. **Skill Extraction**: Cached skill database for faster lookups
3. **Database**: Indexed queries for common operations
4. **CORS**: Configured for optimal performance

## Security Considerations

- ✅ JWT tokens for secure authentication
- ✅ bcrypt password hashing
- ✅ CORS headers configured
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via ORM
- ⚠️ Change SECRET_KEY and JWT_SECRET_KEY in production
- ⚠️ Use HTTPS in production
- ⚠️ Store sensitive data securely

## Deployment

### Production Checklist

1. Set `FLASK_ENV=production`
2. Change `SECRET_KEY` and `JWT_SECRET_KEY`
3. Use PostgreSQL (not SQLite)
4. Enable HTTPS
5. Set CORS origins to your domain
6. Use production WSGI server (Gunicorn, uWSGI)
7. Set up database backups
8. Monitor error logs

### Deploy with Gunicorn

```bash
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 app.app:app
```

## API Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Upload Resume
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@resume.pdf"

# Get Dashboard
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Register
response = requests.post(f"{BASE_URL}/auth/register", json={
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
})
token = response.json()["access_token"]

# Upload Resume
with open("resume.pdf", "rb") as f:
    response = requests.post(
        f"{BASE_URL}/resume/upload",
        files={"file": f},
        headers={"Authorization": f"Bearer {token}"}
    )
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@resumeintelligence.com

## Acknowledgments

- Built with Flask and SQLAlchemy
- PDF processing by pdfplumber
- Authentication with PyJWT
- Security with bcrypt

---

**Resume Intelligence Platform** - Intelligent Resume Analysis & Career Roadmapping
