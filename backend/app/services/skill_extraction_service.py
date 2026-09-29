import re
from typing import List, Set
from app.utils.skills_database import SKILLS_DATABASE


class SkillExtractionService:
    """Service for extracting skills from resume text"""
    
    @staticmethod
    def extract_skills(resume_text: str) -> List[str]:
        """
        Extract skills from resume text by matching against skills database
        
        Args:
            resume_text: Extracted text from resume
            
        Returns:
            List of detected skills
        """
        if not resume_text:
            return []
        
        # Convert text to lowercase for matching
        text_lower = resume_text.lower()
        
        # Normalize common resume phrases to the canonical skills used by role profiles.
        # This keeps matching output consistent while still recognizing long-form wording.
        skill_aliases = {
            'OOP': [
                'Object-Oriented Programming',
                'Object Oriented Programming',
                'Object Oriented Design',
            ],
            'DSA': [
                'Data Structures and Algorithms',
                'Data Structures & Algorithms',
                'Data Structures',
                'Algorithms',
            ],
        }
        
        # Find all skills that appear in the text
        detected_skills = []
        for canonical_skill, aliases in skill_aliases.items():
            for alias in aliases:
                pattern = r'\b' + re.escape(alias.lower()) + r'\b'
                
                if re.search(pattern, text_lower):
                    detected_skills.append(canonical_skill)
                    break
        
        for skill in SKILLS_DATABASE:
            # Create regex patterns for skill detection
            # Match whole words to avoid partial matches
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            
            if re.search(pattern, text_lower):
                detected_skills.append(skill)
        
        # Remove duplicates and sort
        detected_skills = list(set(detected_skills))
        detected_skills.sort()
        
        return detected_skills
    
    @staticmethod
    def extract_resume_metadata(resume_text: str) -> dict:
        """
        Extract basic metadata from resume
        
        Args:
            resume_text: Extracted text from resume
            
        Returns:
            Dictionary with metadata
        """
        metadata = {
            'total_length': len(resume_text),
            'lines': len(resume_text.split('\n')),
            'has_email': bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text)),
            'has_phone': bool(re.search(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', resume_text)),
            'has_github': bool(re.search(r'github\.com|github|git', resume_text.lower())),
            'has_linkedin': bool(re.search(r'linkedin\.com|linkedin', resume_text.lower())),
        }
        return metadata
    
    @staticmethod
    def get_skill_categories(skills: List[str]) -> dict:
        """
        Categorize skills
        
        Args:
            skills: List of skills
            
        Returns:
            Dictionary with categorized skills
        """
        categories = {
            'Programming Languages': [],
            'Frontend': [],
            'Backend': [],
            'Databases': [],
            'DevOps': [],
            'ML/AI': [],
            'Other': []
        }
        
        skill_to_category = {
            # Programming Languages
            'C': 'Programming Languages',
            'C++': 'Programming Languages',
            'Java': 'Programming Languages',
            'Python': 'Programming Languages',
            'JavaScript': 'Programming Languages',
            'TypeScript': 'Programming Languages',
            'Bash': 'Programming Languages',
            
            # Frontend
            'React': 'Frontend',
            'Vue.js': 'Frontend',
            'Angular': 'Frontend',
            'Next.js': 'Frontend',
            'HTML': 'Frontend',
            'CSS': 'Frontend',
            'SCSS': 'Frontend',
            'Tailwind CSS': 'Frontend',
            'UI/UX': 'Frontend',
            'Figma': 'Frontend',
            
            # Backend
            'Node.js': 'Backend',
            'Express': 'Backend',
            'Flask': 'Backend',
            'Django': 'Backend',
            'Spring Boot': 'Backend',
            'REST API': 'Backend',
            'GraphQL': 'Backend',
            'Microservices': 'Backend',
            
            # Databases
            'SQL': 'Databases',
            'PostgreSQL': 'Databases',
            'MySQL': 'Databases',
            'MongoDB': 'Databases',
            'DBMS': 'Databases',
            'Redis': 'Databases',
            'Elasticsearch': 'Databases',
            
            # DevOps
            'Docker': 'DevOps',
            'Kubernetes': 'DevOps',
            'AWS': 'DevOps',
            'Azure': 'DevOps',
            'Google Cloud': 'DevOps',
            'CI/CD': 'DevOps',
            'Jenkins': 'DevOps',
            'GitHub Actions': 'DevOps',
            'Terraform': 'DevOps',
            'Ansible': 'DevOps',
            'Linux': 'DevOps',
            'Docker Compose': 'DevOps',
            'Git': 'DevOps',
            
            # ML/AI
            'Machine Learning': 'ML/AI',
            'Deep Learning': 'ML/AI',
            'TensorFlow': 'ML/AI',
            'PyTorch': 'ML/AI',
            'Scikit-learn': 'ML/AI',
            'Pandas': 'ML/AI',
            'NumPy': 'ML/AI',
            
            # Other
            'DSA': 'Other',
            'OOP': 'Other',
            'System Design': 'Other',
            'Agile': 'Other',
            'JIRA': 'Other',
        }
        
        for skill in skills:
            category = skill_to_category.get(skill, 'Other')
            categories[category].append(skill)
        
        # Remove empty categories
        return {k: v for k, v in categories.items() if v}
