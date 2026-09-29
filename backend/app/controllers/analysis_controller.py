from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.models import Resume, AnalysisResult, CareerRoadmap
from app.services.skill_extraction_service import SkillExtractionService
from app.services.role_matching_service import RoleMatchingService
from app.services.career_roadmap_service import CareerRoadmapService


class AnalysisController:
    """Controller for skill analysis and role matching endpoints"""
    
    @staticmethod
    @jwt_required()
    def extract_skills():
        """
        Extract skills from a resume
        
        Request JSON:
        {
            "resume_id": 1
        }
        """
        try:
            user_id = int(get_jwt_identity())
            data = request.get_json()
            
            if not data or 'resume_id' not in data:
                return jsonify({'error': 'resume_id is required'}), 400
            
            resume = Resume.query.filter_by(
                id=data['resume_id'],
                user_id=user_id
            ).first()
            
            if not resume:
                return jsonify({'error': 'Resume not found'}), 404
            
            # Extract skills
            skills = SkillExtractionService.extract_skills(resume.extracted_text)
            
            # Get skill categories
            categories = SkillExtractionService.get_skill_categories(skills)
            
            # Get metadata
            metadata = SkillExtractionService.extract_resume_metadata(resume.extracted_text)
            
            return jsonify({
                'skills': skills,
                'skill_count': len(skills),
                'categories': categories,
                'metadata': metadata
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def match_role():
        """
        Match user skills against a target role
        
        Request JSON:
        {
            "resume_id": 1,
            "role": "Software Engineer"
        }
        """
        try:
            user_id = int(get_jwt_identity())
            data = request.get_json()
            
            if not data or 'resume_id' not in data or 'role' not in data:
                return jsonify({'error': 'resume_id and role are required'}), 400
            
            resume = Resume.query.filter_by(
                id=data['resume_id'],
                user_id=user_id
            ).first()
            
            if not resume:
                return jsonify({'error': 'Resume not found'}), 404
            
            # Extract skills from resume
            user_skills = SkillExtractionService.extract_skills(resume.extracted_text)
            
            # Match against role
            match_result = RoleMatchingService.match_role(user_skills, data['role'])
            
            # Generate recommendations
            recommendations = RoleMatchingService.generate_recommendations(
                match_result['matched_skills'],
                match_result['missing_skills'],
                data['role']
            )
            
            # Save analysis result
            analysis = AnalysisResult(
                resume_id=data['resume_id'],
                target_role=data['role'],
                score=match_result['score'],
                matched_skills=match_result['matched_skills'],
                missing_skills=match_result['missing_skills'],
                recommendations=recommendations
            )
            
            db.session.add(analysis)
            db.session.commit()
            
            return jsonify({
                'analysis_id': analysis.id,
                'target_role': data['role'],
                'score': match_result['score'],
                'match_percentage': match_result['match_percentage'],
                'matched_skills': match_result['matched_skills'],
                'missing_skills': match_result['missing_skills'],
                'matched_count': len(match_result['matched_skills']),
                'missing_count': len(match_result['missing_skills']),
                'recommendations': recommendations
            }), 201
        
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_available_roles():
        """Get all available role profiles"""
        try:
            roles = RoleMatchingService.get_role_profiles()
            
            return jsonify({
                'roles': roles,
                'total': len(roles)
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_analysis_result(analysis_id):
        """Get specific analysis result"""
        try:
            user_id = int(get_jwt_identity())
            
            # Get analysis with resume verification
            analysis = AnalysisResult.query.join(Resume).filter(
                AnalysisResult.id == analysis_id,
                Resume.user_id == user_id
            ).first()
            
            if not analysis:
                return jsonify({'error': 'Analysis not found'}), 404
            
            return jsonify(analysis.to_dict()), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
