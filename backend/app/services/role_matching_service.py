from typing import List, Dict, Tuple
from app.utils.skills_database import ROLE_PROFILES


class RoleMatchingService:
    """Service for matching user skills against job roles"""
    
    @staticmethod
    def match_role(user_skills: List[str], target_role: str) -> Dict:
        """
        Calculate skill match score and identify gaps for a target role
        
        Args:
            user_skills: List of user's skills
            target_role: Target job role
            
        Returns:
            Dictionary with match score and skill analysis
        """
        if target_role not in ROLE_PROFILES:
            raise ValueError(f"Role '{target_role}' not found in role profiles")
        
        role_profile = ROLE_PROFILES[target_role]
        required_skills = role_profile['required_skills']
        weights = role_profile.get('weight', {})
        
        # Convert user skills to set for faster lookup
        user_skills_set = set(user_skills)
        
        matched_skills = []
        missing_skills = []
        
        for skill in required_skills:
            if skill in user_skills_set:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)
        
        # Calculate weighted score
        total_weight = sum(weights.get(skill, 1.0) for skill in required_skills)
        matched_weight = sum(weights.get(skill, 1.0) for skill in matched_skills)
        
        score = int((matched_weight / total_weight) * 100) if total_weight > 0 else 0
        score = max(0, min(100, score))  # Ensure score is between 0-100
        
        return {
            'score': score,
            'matched_skills': sorted(matched_skills),
            'missing_skills': sorted(missing_skills),
            'match_percentage': f"{score}%"
        }
    
    @staticmethod
    def get_role_profiles() -> Dict:
        """
        Get all available role profiles
        
        Returns:
            Dictionary of all role profiles
        """
        profiles = {}
        for role, profile in ROLE_PROFILES.items():
            profiles[role] = {
                'description': profile['description'],
                'required_skills': profile['required_skills'],
                'skill_count': len(profile['required_skills'])
            }
        return profiles
    
    @staticmethod
    def generate_recommendations(matched_skills: List[str], missing_skills: List[str], target_role: str) -> List[Dict]:
        """
        Generate recommendations based on skill gaps
        
        Args:
            matched_skills: List of matched skills
            missing_skills: List of missing skills
            target_role: Target job role
            
        Returns:
            List of recommendations
        """
        recommendations = []
        
        # Prioritize missing skills
        if missing_skills:
            # High priority - first 3 missing skills
            high_priority = missing_skills[:3]
            recommendations.append({
                'category': 'High Priority Skills',
                'skills': high_priority,
                'reason': f'These are core skills for {target_role} and will significantly improve your fit',
                'estimated_duration': '3-6 months',
                'priority': 'high'
            })
            
            # Medium priority - next missing skills
            if len(missing_skills) > 3:
                medium_priority = missing_skills[3:6]
                recommendations.append({
                    'category': 'Medium Priority Skills',
                    'skills': medium_priority,
                    'reason': f'These skills will complement your profile for {target_role}',
                    'estimated_duration': '2-4 months',
                    'priority': 'medium'
                })
            
            # Low priority - remaining missing skills
            if len(missing_skills) > 6:
                low_priority = missing_skills[6:]
                recommendations.append({
                    'category': 'Optional Skills',
                    'skills': low_priority,
                    'reason': 'Nice-to-have skills that will increase competitiveness',
                    'estimated_duration': '1-3 months',
                    'priority': 'low'
                })
        
        # If all skills matched, recommend specialization
        if not missing_skills and matched_skills:
            recommendations.append({
                'category': 'Specialization',
                'skills': matched_skills[:5],
                'reason': f'Great! You have the core skills for {target_role}. Deepen your expertise in these areas',
                'estimated_duration': 'Ongoing',
                'priority': 'medium'
            })
        
        return recommendations
    
    @staticmethod
    def calculate_overall_resume_score(user_skills: List[str]) -> int:
        """
        Calculate overall resume score based on all detected skills
        
        Args:
            user_skills: List of user's skills
            
        Returns:
            Overall resume score (0-100)
        """
        # Score based on number of skills (max out at 30 unique skills)
        skill_score = min(len(set(user_skills)) / 30 * 50, 50)
        
        # Bonus for having diverse skills across categories
        from app.services.skill_extraction_service import SkillExtractionService
        categories = SkillExtractionService.get_skill_categories(user_skills)
        category_score = (len(categories) / 7) * 30  # Max 7 categories
        
        # Bonus for having popular/in-demand skills
        in_demand_skills = {
            'Python': 1.0, 'JavaScript': 0.9, 'React': 0.9,
            'SQL': 0.8, 'Java': 0.8, 'Docker': 0.7,
            'AWS': 0.7, 'Machine Learning': 0.6, 'TypeScript': 0.6,
        }
        
        in_demand_count = sum(1 for skill in user_skills if skill in in_demand_skills)
        demand_score = (in_demand_count / len(in_demand_skills)) * 20  # Max 20 points
        
        total_score = int(skill_score + category_score + demand_score)
        return min(100, total_score)
