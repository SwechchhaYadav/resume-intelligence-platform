"""Skills database and role profiles"""

# Predefined skills database
SKILLS_DATABASE = [
    "C",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Flask",
    "Django",
    "Spring Boot",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "DSA",
    "OOP",
    "Git",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "Machine Learning",
    "Deep Learning",
    "Data Analysis",
    "Visualization",
    "Excel",
    "Business Intelligence",
    "Statistics",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "REST API",
    "GraphQL",
    "CI/CD",
    "Jenkins",
    "GitHub Actions",
    "Linux",
    "Bash",
    "HTML",
    "CSS",
    "SCSS",
    "Tailwind CSS",
    "Next.js",
    "Vue.js",
    "Angular",
    "Microservices",
    "Agile",
    "JIRA",
    "Figma",
    "UI/UX",
    "System Design",
    "Elasticsearch",
    "Redis",
    "RabbitMQ",
    "Kafka",
    "Docker Compose",
    "Terraform",
    "Ansible",
    "MLOps",
]

# Role profiles with required skills
ROLE_PROFILES = {
    'Software Engineer': {
        'description': 'Full-stack software development professional',
        'required_skills': [
            'Python', 'JavaScript', 'Java', 'C++',
            'DSA', 'OOP', 'System Design',
            'SQL', 'REST API', 'Git',
            'Docker', 'CI/CD'
        ],
        'weight': {
            'Python': 1.0,
            'JavaScript': 0.9,
            'Java': 0.9,
            'C++': 0.8,
            'DSA': 1.0,
            'OOP': 1.0,
            'System Design': 0.8,
            'SQL': 0.7,
            'REST API': 0.7,
            'Git': 0.6,
            'Docker': 0.6,
            'CI/CD': 0.5,
        }
    },
    'Frontend Developer': {
        'description': 'Frontend web development specialist',
        'required_skills': [
            'JavaScript', 'TypeScript', 'React', 'HTML', 'CSS',
            'Tailwind CSS', 'REST API', 'Git', 'UI/UX'
        ],
        'weight': {
            'JavaScript': 1.0,
            'TypeScript': 0.9,
            'React': 1.0,
            'HTML': 1.0,
            'CSS': 1.0,
            'Tailwind CSS': 0.8,
            'REST API': 0.7,
            'Git': 0.7,
            'UI/UX': 0.6,
            'Next.js': 0.7,
            'Vue.js': 0.6,
        }
    },
    'Backend Developer': {
        'description': 'Backend and server-side development specialist',
        'required_skills': [
            'Python', 'Java', 'Node.js', 'Express', 'Flask',
            'SQL', 'PostgreSQL', 'Docker', 'REST API',
            'Microservices', 'System Design'
        ],
        'weight': {
            'Python': 1.0,
            'Java': 0.9,
            'Node.js': 0.8,
            'Express': 0.8,
            'Flask': 0.8,
            'SQL': 1.0,
            'PostgreSQL': 0.9,
            'Docker': 0.7,
            'REST API': 1.0,
            'Microservices': 0.6,
            'System Design': 0.8,
            'Redis': 0.6,
        }
    },
    'Data Analyst': {
        'description': 'Data analysis and visualization professional',
        'required_skills': [
            'Python', 'SQL', 'Pandas', 'NumPy', 'Data Analysis',
            'Visualization', 'Excel', 'Business Intelligence'
        ],
        'weight': {
            'Python': 1.0,
            'SQL': 1.0,
            'Pandas': 0.9,
            'NumPy': 0.8,
            'Data Analysis': 1.0,
            'Visualization': 0.8,
            'Excel': 0.7,
            'Business Intelligence': 0.6,
        }
    },
    'Data Scientist': {
        'description': 'Machine learning and advanced analytics professional',
        'required_skills': [
            'Python', 'Machine Learning', 'Deep Learning',
            'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas',
            'NumPy', 'Statistics', 'SQL'
        ],
        'weight': {
            'Python': 1.0,
            'Machine Learning': 1.0,
            'Deep Learning': 0.8,
            'TensorFlow': 0.8,
            'PyTorch': 0.8,
            'Scikit-learn': 0.9,
            'Pandas': 0.9,
            'NumPy': 0.9,
            'Statistics': 0.8,
            'SQL': 0.7,
        }
    },
    'Machine Learning Engineer': {
        'description': 'Machine learning systems and model development',
        'required_skills': [
            'Python', 'Machine Learning', 'Deep Learning',
            'TensorFlow', 'PyTorch', 'System Design',
            'Docker', 'Kubernetes', 'MLOps'
        ],
        'weight': {
            'Python': 1.0,
            'Machine Learning': 1.0,
            'Deep Learning': 0.9,
            'TensorFlow': 0.9,
            'PyTorch': 0.9,
            'System Design': 0.8,
            'Docker': 0.8,
            'Kubernetes': 0.7,
            'CI/CD': 0.7,
        }
    },
}

# Sample recommendations based on missing skills
RECOMMENDATIONS_TEMPLATE = {
    'high_priority': {
        'title': 'High Priority Skills',
        'description': 'Essential skills needed for this role',
        'duration': '3-6 months'
    },
    'medium_priority': {
        'title': 'Medium Priority Skills',
        'description': 'Important skills to develop',
        'duration': '2-4 months'
    },
    'low_priority': {
        'title': 'Optional Skills',
        'description': 'Nice-to-have skills that will increase competitiveness',
        'duration': '1-3 months'
    }
}
