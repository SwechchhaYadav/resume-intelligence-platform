#!/usr/bin/env python
"""
Flask application entry point

Run with: python run.py
"""

import os
from dotenv import load_dotenv
from app.app import create_app

# Load environment variables
load_dotenv()

# Get environment (default to development)
env = os.getenv('FLASK_ENV', 'development')

# Create app
app = create_app(env)

if __name__ == '__main__':
    print(f"Starting Flask app in {env} mode...")
    print(f"Server running at: http://localhost:5000")
    print(f"API Documentation: http://localhost:5000/api/health")
    
    # Run app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=(env == 'development')
    )
