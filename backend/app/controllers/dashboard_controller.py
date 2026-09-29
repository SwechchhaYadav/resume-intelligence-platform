from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.models import Resume, AnalysisResult, CareerRoadmap
from app.services.skill_extraction_service import SkillExtractionService
from app.services.role_matching_service import RoleMatchingService
from app.services.career_roadmap_service import CareerRoadmapService


class DashboardController:
    """Controller for dashboard and analytics endpoints"""
    
    @staticmethod
    @jwt_required()
    def get_dashboard():
        """
        Get dashboard data for current user
        
        Returns aggregated resume and analysis data
        """
        try:
            user_id = int(get_jwt_identity())
            
            # Get latest resume
            latest_resume = Resume.query.filter_by(user_id=user_id).order_by(
                Resume.uploaded_at.desc()
            ).first()
            
            if not latest_resume:
                return jsonify({
                    'resume_score': 0,
                    'role_fit': 0,
                    'skills_found': 0,
                    'missing_skills': 0,
                    'recommendations': [],
                    'recent_analyses': []
                }), 200
            
            # Extract skills
            skills = SkillExtractionService.extract_skills(latest_resume.extracted_text)
            resume_score = RoleMatchingService.calculate_overall_resume_score(skills)
            
            # Get recent analyses
            analyses = AnalysisResult.query.filter_by(
                resume_id=latest_resume.id
            ).order_by(AnalysisResult.created_at.desc()).limit(5).all()
            
            # Get latest analysis
            latest_analysis = analyses[0] if analyses else None
            
            role_fit = latest_analysis.score if latest_analysis else 0
            missing_skills = latest_analysis.missing_skills if latest_analysis else []
            recommendations = latest_analysis.recommendations if latest_analysis else []
            
            return jsonify({
                'resume_score': resume_score,
                'role_fit': role_fit,
                'skills_found': len(skills),
                'missing_skills': len(missing_skills),
                'target_role': latest_analysis.target_role if latest_analysis else None,
                'recommendations': recommendations[:3],  # Top 3 recommendations
                'recent_analyses': [
                    {
                        'id': a.id,
                        'target_role': a.target_role,
                        'score': a.score,
                        'created_at': a.created_at.isoformat()
                    }
                    for a in analyses
                ],
                'skill_distribution': SkillExtractionService.get_skill_categories(skills)
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_resume_history():
        """Get all resumes and analyses for current user"""
        try:
            user_id = int(get_jwt_identity())
            
            resumes = Resume.query.filter_by(user_id=user_id).order_by(
                Resume.uploaded_at.desc()
            ).all()
            
            history = []
            for resume in resumes:
                # Get analyses for this resume
                analyses = AnalysisResult.query.filter_by(resume_id=resume.id).all()
                
                history.append({
                    'resume': resume.to_dict(),
                    'analyses': [a.to_dict() for a in analyses],
                    'skill_count': len(
                        SkillExtractionService.extract_skills(resume.extracted_text)
                    )
                })
            
            return jsonify({
                'history': history,
                'total_resumes': len(resumes)
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500


class RoadmapController:
    """Controller for career roadmap endpoints"""
    
    @staticmethod
    @jwt_required()
    def generate_roadmap():
        """
        Generate career roadmap for a role
        
        Request JSON:
        {
            "analysis_id": 1
        }
        """
        try:
            user_id = int(get_jwt_identity())
            data = request.get_json()
            
            if not data or 'analysis_id' not in data:
                return jsonify({'error': 'analysis_id is required'}), 400
            
            # Get analysis result
            analysis = AnalysisResult.query.join(Resume).filter(
                AnalysisResult.id == data['analysis_id'],
                Resume.user_id == user_id
            ).first()
            
            if not analysis:
                return jsonify({'error': 'Analysis not found'}), 404
            
            # Check if roadmap already exists
            existing_roadmap = CareerRoadmap.query.filter_by(
                analysis_id=data['analysis_id']
            ).first()
            
            if existing_roadmap:
                return jsonify({
                    'message': 'Roadmap already exists',
                    'roadmap': existing_roadmap.to_dict()
                }), 200
            
            # Generate roadmap
            roadmap_data = CareerRoadmapService.generate_roadmap(
                analysis.missing_skills,
                analysis.target_role
            )
            
            # Save roadmap
            roadmap = CareerRoadmap(
                analysis_id=data['analysis_id'],
                roadmap_data=roadmap_data
            )
            
            db.session.add(roadmap)
            db.session.commit()
            
            return jsonify({
                'message': 'Roadmap generated successfully',
                'roadmap': roadmap.to_dict()
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_roadmap(roadmap_id):
        """Get specific roadmap"""
        try:
            user_id = int(get_jwt_identity())
            
            roadmap = CareerRoadmap.query.join(AnalysisResult).join(Resume).filter(
                CareerRoadmap.id == roadmap_id,
                Resume.user_id == user_id
            ).first()
            
            if not roadmap:
                return jsonify({'error': 'Roadmap not found'}), 404
            
            return jsonify(roadmap.to_dict()), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_all_roadmaps():
        """Get all roadmaps for current user"""
        try:
            user_id = int(get_jwt_identity())
            
            roadmaps = CareerRoadmap.query.join(AnalysisResult).join(Resume).filter(
                Resume.user_id == user_id
            ).order_by(CareerRoadmap.created_at.desc()).all()
            
            return jsonify({
                'roadmaps': [roadmap.to_dict() for roadmap in roadmaps],
                'total': len(roadmaps)
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
