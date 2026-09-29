from datetime import datetime
from app.extensions import db
import bcrypt


class User(db.Model):
    """User model for authentication and profile management"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    resumes = db.relationship('Resume', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Resume(db.Model):
    """Resume model for storing uploaded resumes"""
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    extracted_text = db.Column(db.Text)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    analyses = db.relationship('AnalysisResult', backref='resume', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert resume to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'uploaded_at': self.uploaded_at.isoformat()
        }


class AnalysisResult(db.Model):
    """Analysis result model for storing skill analysis and matching results"""
    __tablename__ = 'analysis_results'
    
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    target_role = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer, nullable=False)  # 0-100
    matched_skills = db.Column(db.JSON, nullable=False, default=list)
    missing_skills = db.Column(db.JSON, nullable=False, default=list)
    recommendations = db.Column(db.JSON, nullable=False, default=list)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    roadmap = db.relationship('CareerRoadmap', backref='analysis', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert analysis result to dictionary"""
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'target_role': self.target_role,
            'score': self.score,
            'matched_skills': self.matched_skills,
            'missing_skills': self.missing_skills,
            'recommendations': self.recommendations,
            'created_at': self.created_at.isoformat()
        }


class CareerRoadmap(db.Model):
    """Career roadmap model for storing generated roadmaps"""
    __tablename__ = 'career_roadmaps'
    
    id = db.Column(db.Integer, primary_key=True)
    analysis_id = db.Column(db.Integer, db.ForeignKey('analysis_results.id'), nullable=False, unique=True)
    roadmap_data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert roadmap to dictionary"""
        return {
            'id': self.id,
            'analysis_id': self.analysis_id,
            'roadmap_data': self.roadmap_data,
            'created_at': self.created_at.isoformat()
        }
