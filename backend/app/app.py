import os
from flask import Flask, app, jsonify
from app.extensions import db, jwt, cors
from app.config.config import config
from app.routes.api_routes import (
    auth_bp, resume_bp, analysis_bp, dashboard_bp, roadmap_bp
)


def create_app(config_name='development'):
    """Application factory function"""
    
    # Get config
    app_config = config.get(config_name, config['default'])
    
    # Create Flask app
    app = Flask(__name__)
    app.config.from_object(app_config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Initialize CORS
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": "http://localhost:4173"}},
        supports_credentials=True
    )
    
    # Import models to register them with SQLAlchemy
    from app.models.models import User, Resume, AnalysisResult, CareerRoadmap
    
    # Create upload folder
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(roadmap_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'Resume Intelligence Platform API'}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
