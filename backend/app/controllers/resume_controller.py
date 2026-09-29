from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models.models import Resume
from app.services.resume_service import ResumeProcessingService
from app.services.skill_extraction_service import SkillExtractionService


class ResumeController:
    """Controller for resume management endpoints"""
    
    @staticmethod
    def allowed_file(filename):
        """Check if file extension is allowed"""
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
    
    @staticmethod
    @jwt_required()
    def upload_resume():
        """
        Upload and process a resume PDF
        
        Request: multipart/form-data with file field
        """
        try:
            user_id = int(get_jwt_identity())
            
            # Check if file is present
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not ResumeController.allowed_file(file.filename):
                return jsonify({'error': 'Only PDF files are allowed'}), 400
            
            # Generate safe filename
            safe_filename = ResumeProcessingService.generate_safe_filename(
                file.filename, user_id
            )
            
            # Save file
            file_path = ResumeProcessingService.save_uploaded_file(
                file, current_app.config['UPLOAD_FOLDER'], safe_filename
            )
            
            # Validate PDF
            if not ResumeProcessingService.validate_pdf_file(file_path):
                return jsonify({'error': 'Invalid PDF file'}), 400
            
            # Extract text from PDF
            extracted_text = ResumeProcessingService.extract_text_from_pdf(file_path)
            
            # Save resume to database
            resume = Resume(
                user_id=user_id,
                filename=file.filename,
                file_path=file_path,
                extracted_text=extracted_text
            )
            
            db.session.add(resume)
            db.session.commit()
            
            # Extract skills
            detected_skills = SkillExtractionService.extract_skills(extracted_text)
            
            return jsonify({
                'message': 'Resume uploaded successfully',
                'resume': resume.to_dict(),
                'extracted_text': extracted_text[:500] + '...' if len(extracted_text) > 500 else extracted_text,
                'detected_skills': detected_skills,
                'skill_count': len(detected_skills)
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_resumes():
        """Get all resumes for current user"""
        try:
            user_id = int(get_jwt_identity())
            
            resumes = Resume.query.filter_by(user_id=user_id).order_by(
                Resume.uploaded_at.desc()
            ).all()
            
            return jsonify({
                'resumes': [resume.to_dict() for resume in resumes],
                'total': len(resumes)
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_resume(resume_id):
        """Get specific resume"""
        try:
            user_id = int(get_jwt_identity())
            
            resume = Resume.query.filter_by(
                id=resume_id,
                user_id=user_id
            ).first()
            
            if not resume:
                return jsonify({'error': 'Resume not found'}), 404
            
            # Extract skills from stored text
            detected_skills = SkillExtractionService.extract_skills(resume.extracted_text)
            
            # Get skill categories
            skill_categories = SkillExtractionService.get_skill_categories(detected_skills)
            
            return jsonify({
                'resume': resume.to_dict(),
                'extracted_text': resume.extracted_text,
                'detected_skills': detected_skills,
                'skill_categories': skill_categories
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def delete_resume(resume_id):
        """Delete a resume"""
        try:
            user_id = int(get_jwt_identity())
            
            resume = Resume.query.filter_by(
                id=resume_id,
                user_id=user_id
            ).first()
            
            if not resume:
                return jsonify({'error': 'Resume not found'}), 404
            
            # Delete file from disk
            import os
            try:
                os.remove(resume.file_path)
            except Exception:
                pass  # File might already be deleted
            
            db.session.delete(resume)
            db.session.commit()
            
            return jsonify({'message': 'Resume deleted successfully'}), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
