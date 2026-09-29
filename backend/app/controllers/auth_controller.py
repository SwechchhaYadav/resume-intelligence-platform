from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.models import User


class AuthController:
    """Controller for authentication endpoints"""
    
    @staticmethod
    def register():
        """
        Register a new user
        
        Request JSON:
        {
            "full_name": "John Doe",
            "email": "john@example.com",
            "password": "password123"
        }
        """
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            # Validate input
            if not data.get('full_name'):
                return jsonify({'error': 'full_name is required'}), 400
            if not data.get('email'):
                return jsonify({'error': 'email is required'}), 400
            if not data.get('password'):
                return jsonify({'error': 'password is required'}), 400
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return jsonify({'error': 'Email already registered'}), 409
            
            # Create new user
            user = User(
                full_name=data['full_name'],
                email=data['email']
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            # Create access token
            access_token = create_access_token(identity=str(user.id))         


            return jsonify({
                'message': 'User registered successfully',
                'user': user.to_dict(),
                'access_token': access_token
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def login():
        """
        Login user
        
        Request JSON:
        {
            "email": "john@example.com",
            "password": "password123"
        }
        """
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            if not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Find user
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not user.check_password(data['password']):
                return jsonify({'error': 'Invalid email or password'}), 401
            
            # Create access token
            access_token = create_access_token(identity=str(user.id))


            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict(),
                'access_token': access_token
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_profile():
        """Get current user profile"""
        try:
            user_id = int(get_jwt_identity())   
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify(user.to_dict()), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def update_profile():
        """
        Update user profile
        
        Request JSON:
        {
            "full_name": "Jane Doe"
        }
        """
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            data = request.get_json()
            
            if 'full_name' in data:
                user.full_name = data['full_name']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Profile updated successfully',
                'user': user.to_dict()
            }), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
