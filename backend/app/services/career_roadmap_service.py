from typing import List, Dict
from datetime import datetime, timedelta


class CareerRoadmapService:
    """Service for generating career roadmaps based on skill gaps"""
    
    SKILL_LEARNING_PATHS = {
        # Programming
        'Python': {'duration': '3 months', 'resources': ['Udemy', 'Codecademy', 'Real Python']},
        'JavaScript': {'duration': '3 months', 'resources': ['Udemy', 'freeCodeCamp', 'Codecademy']},
        'TypeScript': {'duration': '2 months', 'resources': ['Official Docs', 'Udemy']},
        'Java': {'duration': '4 months', 'resources': ['Oracle Tutorials', 'Udemy']},
        'C++': {'duration': '5 months', 'resources': ['cplusplus.com', 'Udemy']},
        
        # Frontend
        'React': {'duration': '3 months', 'resources': ['React Docs', 'Frontend Masters', 'Udemy']},
        'Vue.js': {'duration': '3 months', 'resources': ['Vue Docs', 'Vue Mastery']},
        'Angular': {'duration': '4 months', 'resources': ['Angular Docs', 'Udemy']},
        'HTML': {'duration': '2 weeks', 'resources': ['MDN', 'freeCodeCamp']},
        'CSS': {'duration': '1 month', 'resources': ['MDN', 'CSS-Tricks', 'Udemy']},
        'Tailwind CSS': {'duration': '1 month', 'resources': ['Tailwind Docs', 'YouTube']},
        'Next.js': {'duration': '2 months', 'resources': ['Next.js Docs', 'Vercel Tutorials']},
        
        # Backend
        'Node.js': {'duration': '3 months', 'resources': ['Node.js Docs', 'Udemy', 'Frontend Masters']},
        'Express': {'duration': '2 months', 'resources': ['Express Docs', 'Udemy']},
        'Flask': {'duration': '2 months', 'resources': ['Flask Docs', 'Miguel Grinberg Blog']},
        'Django': {'duration': '3 months', 'resources': ['Django Docs', 'Udemy']},
        'Spring Boot': {'duration': '4 months', 'resources': ['Spring Docs', 'Udemy']},
        'REST API': {'duration': '2 months', 'resources': ['Official Docs', 'Udemy']},
        'GraphQL': {'duration': '2 months', 'resources': ['GraphQL Docs', 'Frontend Masters']},
        
        # Databases
        'SQL': {'duration': '2 months', 'resources': ['Mode Analytics', 'SQLZoo', 'Udemy']},
        'PostgreSQL': {'duration': '1.5 months', 'resources': ['PostgreSQL Docs', 'Udemy']},
        'MongoDB': {'duration': '1.5 months', 'resources': ['MongoDB Docs', 'Udemy']},
        'Redis': {'duration': '1 month', 'resources': ['Redis Docs', 'Udemy']},
        
        # DevOps
        'Docker': {'duration': '2 months', 'resources': ['Docker Docs', 'Udemy', 'Play with Docker']},
        'Kubernetes': {'duration': '3 months', 'resources': ['Kubernetes Docs', 'Linux Academy']},
        'AWS': {'duration': '3 months', 'resources': ['AWS Training', 'A Cloud Guru', 'Linux Academy']},
        'CI/CD': {'duration': '1.5 months', 'resources': ['Jenkins Docs', 'GitLab CI Docs']},
        'Git': {'duration': '1 month', 'resources': ['Git Docs', 'GitHub Learning']},
        
        # ML/AI
        'Machine Learning': {'duration': '4 months', 'resources': ['Coursera', 'Fast.ai', 'Udacity']},
        'Deep Learning': {'duration': '4 months', 'resources': ['Fast.ai', 'Stanford Courses']},
        'TensorFlow': {'duration': '3 months', 'resources': ['TensorFlow Tutorials', 'Udemy']},
        'PyTorch': {'duration': '3 months', 'resources': ['PyTorch Tutorials', 'Udemy']},
        'Pandas': {'duration': '1 month', 'resources': ['Pandas Docs', 'DataCamp']},
        'NumPy': {'duration': '1 month', 'resources': ['NumPy Docs', 'DataCamp']},
        
        # Soft Skills
        'System Design': {'duration': '3 months', 'resources': ['Grokking', 'YouTube', 'Interview Bit']},
        'OOP': {'duration': '2 months', 'resources': ['Design Patterns', 'YouTube']},
        'DSA': {'duration': '3 months', 'resources': ['LeetCode', 'HackerRank', 'InterviewBit']},
    }
    
    @staticmethod
    def generate_roadmap(missing_skills: List[str], target_role: str) -> Dict:
        """
        Generate a career roadmap for skill development
        
        Args:
            missing_skills: List of skills to learn
            target_role: Target job role
            
        Returns:
            Dictionary with roadmap data
        """
        if not missing_skills:
            return {
                'months': [
                    {
                        'month': 1,
                        'title': 'Specialization Phase',
                        'goals': ['Deepen expertise in current skills', 'Build advanced projects'],
                        'milestones': ['Complete 1 advanced project', 'Contribute to open source'],
                        'resources': []
                    }
                ]
            }
        
        # Organize skills by learning duration
        short_skills = []  # < 2 months
        medium_skills = []  # 2-3 months
        long_skills = []  # > 3 months
        
        for skill in missing_skills:
            skill_info = CareerRoadmapService.SKILL_LEARNING_PATHS.get(
                skill, {'duration': '2 months', 'resources': ['Online Course', 'Documentation']}
            )
            duration = skill_info.get('duration', '2 months')
            
            if '1 week' in duration or '2 weeks' in duration:
                short_skills.append((skill, skill_info))
            elif '4 months' in duration or '5 months' in duration:
                long_skills.append((skill, skill_info))
            else:
                medium_skills.append((skill, skill_info))
        
        # Create 6-month roadmap
        roadmap = {'months': []}
        
        # Month 1-2: Foundation skills
        month1_goals = []
        month1_milestones = []
        month1_resources = set()
        
        for skill, info in short_skills[:2]:
            month1_goals.append(f'Master {skill}')
            month1_milestones.append(f'Complete {skill} course')
            month1_resources.update(info.get('resources', []))
        
        if month1_goals:
            roadmap['months'].append({
                'month': 1,
                'title': 'Foundation Building',
                'goals': month1_goals,
                'milestones': month1_milestones,
                'resources': list(month1_resources)[:3]
            })
        
        # Month 2-3: Core skills
        month2_goals = []
        month2_milestones = []
        month2_resources = set()
        
        for skill, info in medium_skills[:2]:
            month2_goals.append(f'Learn {skill}')
            month2_milestones.append(f'Build project with {skill}')
            month2_resources.update(info.get('resources', []))
        
        if month2_goals:
            roadmap['months'].append({
                'month': 2,
                'title': 'Core Skills Development',
                'goals': month2_goals,
                'milestones': month2_milestones,
                'resources': list(month2_resources)[:3]
            })
        
        # Month 3-4: Advanced skills
        month3_goals = []
        month3_milestones = []
        month3_resources = set()
        
        for skill, info in medium_skills[2:4]:
            month3_goals.append(f'Study {skill}')
            month3_milestones.append(f'Practice {skill} concepts')
            month3_resources.update(info.get('resources', []))
        
        if month3_goals or long_skills:
            if not month3_goals:
                month3_goals = [f'Begin {long_skills[0][0]} preparation']
                month3_milestones = [f'Complete introductory {long_skills[0][0]} content']
                month3_resources.update(long_skills[0][1].get('resources', []))
            
            roadmap['months'].append({
                'month': 3,
                'title': 'Advanced Learning',
                'goals': month3_goals,
                'milestones': month3_milestones,
                'resources': list(month3_resources)[:3]
            })
        
        # Month 4: Long-duration skills
        month4_goals = []
        month4_milestones = []
        month4_resources = set()
        
        for skill, info in long_skills[:2]:
            month4_goals.append(f'Begin {skill} journey')
            month4_milestones.append(f'Complete {skill} fundamentals')
            month4_resources.update(info.get('resources', []))
        
        if month4_goals:
            roadmap['months'].append({
                'month': 4,
                'title': 'Long-term Learning',
                'goals': month4_goals,
                'milestones': month4_milestones,
                'resources': list(month4_resources)[:3]
            })
        
        # Month 5: Integration
        roadmap['months'].append({
            'month': 5,
            'title': 'Integration & Practice',
            'goals': [
                'Integrate multiple skills into projects',
                'Build a portfolio project using new skills',
                'Practice interview questions'
            ],
            'milestones': [
                'Complete 1 full-stack project',
                'Get code review from senior',
                'Document lessons learned'
            ],
            'resources': ['GitHub', 'Code Review', 'Technical Blogs']
        })
        
        # Month 6: Specialization
        roadmap['months'].append({
            'month': 6,
            'title': f'Specialization for {target_role}',
            'goals': [
                f'Prepare for {target_role} role interviews',
                'Showcase projects on GitHub',
                'Network with professionals'
            ],
            'milestones': [
                'Polish resume and LinkedIn',
                'Participate in tech community',
                'Apply for roles matching profile'
            ],
            'resources': ['LinkedIn', 'GitHub', 'Tech Communities']
        })
        
        return roadmap
    
    @staticmethod
    def get_skill_learning_time(skill: str) -> str:
        """Get estimated learning time for a skill"""
        skill_info = CareerRoadmapService.SKILL_LEARNING_PATHS.get(
            skill, {'duration': '2 months'}
        )
        return skill_info.get('duration', '2 months')
    
    @staticmethod
    def get_skill_resources(skill: str) -> List[str]:
        """Get learning resources for a skill"""
        skill_info = CareerRoadmapService.SKILL_LEARNING_PATHS.get(
            skill, {'resources': ['Online Courses', 'Official Documentation']}
        )
        return skill_info.get('resources', [])
