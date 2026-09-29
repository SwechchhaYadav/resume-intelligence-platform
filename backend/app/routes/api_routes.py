from flask import Blueprint
from app.controllers.auth_controller import AuthController
from app.controllers.resume_controller import ResumeController
from app.controllers.analysis_controller import AnalysisController
from app.controllers.dashboard_controller import DashboardController, RoadmapController


# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')
analysis_bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')
roadmap_bp = Blueprint('roadmap', __name__, url_prefix='/api/roadmap')


# Auth routes
@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register()


@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()


@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    return AuthController.get_profile()


@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    return AuthController.update_profile()


# Resume routes
@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    return ResumeController.upload_resume()


@resume_bp.route('', methods=['GET'])
def get_resumes():
    return ResumeController.get_resumes()


@resume_bp.route('/<int:resume_id>', methods=['GET'])
def get_resume(resume_id):
    return ResumeController.get_resume(resume_id)


@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    return ResumeController.delete_resume(resume_id)


# Analysis routes
@analysis_bp.route('/extract-skills', methods=['POST'])
def extract_skills():
    return AnalysisController.extract_skills()


@analysis_bp.route('/match-role', methods=['POST'])
def match_role():
    return AnalysisController.match_role()


@analysis_bp.route('/roles', methods=['GET'])
def get_available_roles():
    return AnalysisController.get_available_roles()


@analysis_bp.route('/<int:analysis_id>', methods=['GET'])
def get_analysis_result(analysis_id):
    return AnalysisController.get_analysis_result(analysis_id)


# Dashboard routes
@dashboard_bp.route('', methods=['GET'])
def get_dashboard():
    return DashboardController.get_dashboard()


@dashboard_bp.route('/history', methods=['GET'])
def get_resume_history():
    return DashboardController.get_resume_history()


# Roadmap routes
@roadmap_bp.route('/generate', methods=['POST'])
def generate_roadmap():
    return RoadmapController.generate_roadmap()


@roadmap_bp.route('/<int:roadmap_id>', methods=['GET'])
def get_roadmap(roadmap_id):
    return RoadmapController.get_roadmap(roadmap_id)


@roadmap_bp.route('', methods=['GET'])
def get_all_roadmaps():
    return RoadmapController.get_all_roadmaps()
