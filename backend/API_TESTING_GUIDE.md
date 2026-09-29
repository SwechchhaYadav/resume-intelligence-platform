# Resume Intelligence Platform Backend - API Testing Guide

Complete guide with curl examples for every API endpoint.

## Prerequisites

- Backend running on `http://localhost:5000`
- PostgreSQL database configured
- `.env` file properly configured

## Quick Start

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python init_db.py
python run.py
```

The API will be available at `http://localhost:5000`

### 2. Health Check

```bash
curl -X GET http://localhost:5000/api/health
```

Expected Response:
```json
{
  "status": "healthy",
  "message": "Resume Intelligence Platform API"
}
```

---

## Authentication Endpoints

All protected endpoints require: `Authorization: Bearer {access_token}`

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-06-07T10:00:00",
    "updated_at": "2026-06-07T10:00:00"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Save this token for future requests:**
```bash
export TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-06-07T10:00:00",
    "updated_at": "2026-06-07T10:00:00"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get Current User Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-06-07T10:00:00",
  "updated_at": "2026-06-07T10:00:00"
}
```

### Update User Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "full_name": "Jane Doe",
    "email": "john@example.com",
    "created_at": "2026-06-07T10:00:00",
    "updated_at": "2026-06-07T10:00:01"
  }
}
```

---

## Resume Management Endpoints

### Upload Resume (PDF File)

First, you need a sample PDF. Create one or use an existing resume:

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/resume.pdf"
```

**Expected Response (201):**
```json
{
  "message": "Resume uploaded successfully",
  "resume": {
    "id": 1,
    "user_id": 1,
    "filename": "resume.pdf",
    "uploaded_at": "2026-06-07T10:00:00"
  },
  "extracted_text": "John Doe\nSoftware Engineer\nExperienced Python developer...",
  "detected_skills": [
    "Python",
    "JavaScript",
    "React",
    "SQL",
    "Docker",
    "AWS"
  ],
  "skill_count": 6
}
```

**Save the resume ID:**
```bash
export RESUME_ID=1
```

### Get All Resumes

```bash
curl -X GET http://localhost:5000/api/resume \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "resumes": [
    {
      "id": 1,
      "user_id": 1,
      "filename": "resume.pdf",
      "uploaded_at": "2026-06-07T10:00:00"
    }
  ],
  "total": 1
}
```

### Get Specific Resume with Full Details

```bash
curl -X GET http://localhost:5000/api/resume/$RESUME_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "resume": {
    "id": 1,
    "user_id": 1,
    "filename": "resume.pdf",
    "uploaded_at": "2026-06-07T10:00:00"
  },
  "extracted_text": "Full resume text here...",
  "detected_skills": [
    "Python",
    "JavaScript",
    "React",
    "SQL",
    "Docker",
    "AWS"
  ],
  "skill_categories": {
    "Programming Languages": ["Python", "JavaScript"],
    "Frontend": ["React"],
    "Databases": ["SQL"],
    "DevOps": ["Docker", "AWS"]
  }
}
```

### Delete Resume

```bash
curl -X DELETE http://localhost:5000/api/resume/$RESUME_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Resume deleted successfully"
}
```

---

## Skill Analysis Endpoints

### Extract Skills from Resume

```bash
curl -X POST http://localhost:5000/api/analysis/extract-skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": '$RESUME_ID'
  }'
```

**Expected Response (200):**
```json
{
  "skills": [
    "Python",
    "JavaScript",
    "React",
    "SQL",
    "Docker",
    "AWS"
  ],
  "skill_count": 6,
  "categories": {
    "Programming Languages": ["Python", "JavaScript"],
    "Frontend": ["React"],
    "Databases": ["SQL"],
    "DevOps": ["Docker", "AWS"]
  },
  "metadata": {
    "total_length": 2500,
    "lines": 120,
    "has_email": true,
    "has_phone": true,
    "has_github": true,
    "has_linkedin": true
  }
}
```

### Get Available Roles

```bash
curl -X GET http://localhost:5000/api/analysis/roles \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "roles": {
    "Software Engineer": {
      "description": "Full-stack software development professional",
      "required_skills": ["Python", "JavaScript", "Java", "C++", "DSA", "OOP", "System Design", "SQL", "REST API", "Git", "Docker", "CI/CD"],
      "skill_count": 12
    },
    "Frontend Developer": {
      "description": "Frontend web development specialist",
      "required_skills": ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Tailwind CSS", "REST API", "Git", "UI/UX"],
      "skill_count": 9
    },
    "Backend Developer": {
      "description": "Backend and server-side development specialist",
      "required_skills": ["Python", "Java", "Node.js", "Express", "Flask", "SQL", "PostgreSQL", "Docker", "REST API", "Microservices", "System Design"],
      "skill_count": 11
    },
    "Data Analyst": {
      "description": "Data analysis and visualization professional",
      "required_skills": ["Python", "SQL", "Pandas", "NumPy", "Data Analysis", "Visualization", "Excel", "Business Intelligence"],
      "skill_count": 8
    },
    "Data Scientist": {
      "description": "Machine learning and advanced analytics professional",
      "required_skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Statistics", "SQL"],
      "skill_count": 10
    },
    "Machine Learning Engineer": {
      "description": "Machine learning systems and model development",
      "required_skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "System Design", "Docker", "Kubernetes", "MLOps"],
      "skill_count": 9
    }
  },
  "total": 6
}
```

### Match Skills Against a Role

```bash
curl -X POST http://localhost:5000/api/analysis/match-role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": '$RESUME_ID',
    "role": "Software Engineer"
  }'
```

**Expected Response (201):**
```json
{
  "analysis_id": 1,
  "target_role": "Software Engineer",
  "score": 75,
  "match_percentage": "75%",
  "matched_skills": [
    "Python",
    "JavaScript",
    "SQL",
    "Docker",
    "AWS",
    "Git"
  ],
  "missing_skills": [
    "Java",
    "C++",
    "DSA",
    "OOP",
    "System Design",
    "REST API",
    "CI/CD"
  ],
  "matched_count": 6,
  "missing_count": 7,
  "recommendations": [
    {
      "category": "High Priority Skills",
      "skills": ["DSA", "OOP", "System Design"],
      "reason": "These are core skills for Software Engineer and will significantly improve your fit",
      "estimated_duration": "3-6 months",
      "priority": "high"
    },
    {
      "category": "Medium Priority Skills",
      "skills": ["Java", "C++", "REST API"],
      "reason": "These skills will complement your profile for Software Engineer",
      "estimated_duration": "2-4 months",
      "priority": "medium"
    }
  ]
}
```

**Save the analysis ID:**
```bash
export ANALYSIS_ID=1
```

---

## Dashboard Endpoints

### Get Dashboard Data

```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "resume_score": 72,
  "role_fit": 75,
  "skills_found": 6,
  "missing_skills": 7,
  "target_role": "Software Engineer",
  "recommendations": [
    {
      "category": "High Priority Skills",
      "skills": ["DSA", "OOP", "System Design"],
      "reason": "These are core skills for Software Engineer and will significantly improve your fit",
      "estimated_duration": "3-6 months",
      "priority": "high"
    }
  ],
  "recent_analyses": [
    {
      "id": 1,
      "target_role": "Software Engineer",
      "score": 75,
      "created_at": "2026-06-07T10:00:00"
    }
  ],
  "skill_distribution": {
    "Programming Languages": ["Python", "JavaScript"],
    "Frontend": ["React"],
    "Databases": ["SQL"],
    "DevOps": ["Docker", "AWS"]
  }
}
```

### Get Resume History

```bash
curl -X GET http://localhost:5000/api/dashboard/history \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "history": [
    {
      "resume": {
        "id": 1,
        "user_id": 1,
        "filename": "resume.pdf",
        "uploaded_at": "2026-06-07T10:00:00"
      },
      "analyses": [
        {
          "id": 1,
          "resume_id": 1,
          "target_role": "Software Engineer",
          "score": 75,
          "matched_skills": ["Python", "JavaScript", "SQL", "Docker", "AWS", "Git"],
          "missing_skills": ["Java", "C++", "DSA", "OOP", "System Design", "REST API", "CI/CD"],
          "recommendations": [...],
          "created_at": "2026-06-07T10:00:00"
        }
      ],
      "skill_count": 6
    }
  ],
  "total_resumes": 1
}
```

---

## Career Roadmap Endpoints

### Generate Career Roadmap

```bash
curl -X POST http://localhost:5000/api/roadmap/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "analysis_id": '$ANALYSIS_ID'
  }'
```

**Expected Response (201):**
```json
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
          "goals": [
            "Master DSA",
            "Learn OOP principles"
          ],
          "milestones": [
            "Complete DSA course",
            "Build OOP project"
          ],
          "resources": ["LeetCode", "InterviewBit", "Design Patterns"]
        },
        {
          "month": 2,
          "title": "Core Skills Development",
          "goals": [
            "Learn System Design",
            "Study Java"
          ],
          "milestones": [
            "Build project with Java",
            "Practice System Design concepts"
          ],
          "resources": ["Grokking", "Oracle Tutorials", "YouTube"]
        },
        {
          "month": 3,
          "title": "Advanced Learning",
          "goals": [
            "Study C++ basics"
          ],
          "milestones": [
            "Practice C++ concepts"
          ],
          "resources": ["cplusplus.com", "Udemy"]
        },
        {
          "month": 4,
          "title": "Long-term Learning",
          "goals": [
            "Begin REST API journey"
          ],
          "milestones": [
            "Complete REST API fundamentals"
          ],
          "resources": ["Official Docs", "Udemy"]
        },
        {
          "month": 5,
          "title": "Integration & Practice",
          "goals": [
            "Integrate multiple skills into projects",
            "Build a portfolio project using new skills",
            "Practice interview questions"
          ],
          "milestones": [
            "Complete 1 full-stack project",
            "Get code review from senior",
            "Document lessons learned"
          ],
          "resources": ["GitHub", "Code Review", "Technical Blogs"]
        },
        {
          "month": 6,
          "title": "Specialization for Software Engineer",
          "goals": [
            "Prepare for Software Engineer role interviews",
            "Showcase projects on GitHub",
            "Network with professionals"
          ],
          "milestones": [
            "Polish resume and LinkedIn",
            "Participate in tech community",
            "Apply for roles matching profile"
          ],
          "resources": ["LinkedIn", "GitHub", "Tech Communities"]
        }
      ]
    },
    "created_at": "2026-06-07T10:00:00"
  }
}
```

**Save the roadmap ID:**
```bash
export ROADMAP_ID=1
```

### Get Specific Roadmap

```bash
curl -X GET http://localhost:5000/api/roadmap/$ROADMAP_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "id": 1,
  "analysis_id": 1,
  "roadmap_data": {
    "months": [...]
  },
  "created_at": "2026-06-07T10:00:00"
}
```

### Get All Roadmaps

```bash
curl -X GET http://localhost:5000/api/roadmap \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "roadmaps": [
    {
      "id": 1,
      "analysis_id": 1,
      "roadmap_data": {...},
      "created_at": "2026-06-07T10:00:00"
    }
  ],
  "total": 1
}
```

---

## Complete Testing Workflow

### Test Script (Bash)

Save as `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Resume Intelligence Platform API Test ===${NC}\n"

# 1. Register
echo -e "${GREEN}1. Testing Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Registration failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Registration successful${NC}\n"

# 2. Get Profile
echo -e "${GREEN}2. Testing Get Profile...${NC}"
curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq .
echo -e "${GREEN}✓ Profile retrieved${NC}\n"

# 3. Upload Resume (requires an actual PDF)
echo -e "${GREEN}3. Testing Resume Upload...${NC}"
# Note: Replace with actual PDF path
# UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/resume/upload \
#   -H "Authorization: Bearer $TOKEN" \
#   -F "file=@resume.pdf")
# RESUME_ID=$(echo $UPLOAD_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -1)
# echo -e "${GREEN}✓ Resume uploaded (ID: $RESUME_ID)${NC}\n"

echo -e "${GREEN}=== All tests passed! ===${NC}"
```

Run:
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## Error Responses

### Common Errors and Fixes

#### 401 Unauthorized
```json
{
  "msg": "Missing Authorization Header"
}
```
**Fix:** Add Authorization header with valid token

#### 400 Bad Request
```json
{
  "error": "email is required"
}
```
**Fix:** Check request body has all required fields

#### 404 Not Found
```json
{
  "error": "Resume not found"
}
```
**Fix:** Verify the resource ID exists and belongs to user

#### 409 Conflict
```json
{
  "error": "Email already registered"
}
```
**Fix:** Use a different email address

---

## Testing with Python

```python
import requests
import json

BASE_URL = "http://localhost:5000/api"

# Register
response = requests.post(f"{BASE_URL}/auth/register", json={
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
})
data = response.json()
token = data['access_token']
print(f"Token: {token}")

# Upload resume
with open("resume.pdf", "rb") as f:
    files = {"file": f}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/resume/upload", files=files, headers=headers)
    resume_data = response.json()
    resume_id = resume_data['resume']['id']

# Match role
response = requests.post(f"{BASE_URL}/analysis/match-role", 
    json={"resume_id": resume_id, "role": "Software Engineer"},
    headers=headers)
print(json.dumps(response.json(), indent=2))

# Get dashboard
response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
print(json.dumps(response.json(), indent=2))
```

---

## Performance Tips

1. **Token Caching**: Save token after login/register to avoid repeated authentication
2. **Batch Requests**: Process multiple analyses before retrieving dashboard
3. **File Optimization**: Use compressed PDFs (< 5MB) for faster processing
4. **Parallel Testing**: Use concurrent curl requests for stress testing

---

## Support

For issues with specific endpoints, check the backend logs:

```bash
# Check Flask logs
tail -f flask.log

# Enable debug logging
export FLASK_DEBUG=1
python run.py
```
