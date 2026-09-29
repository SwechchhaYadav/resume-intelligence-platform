"""
Database initialization script

Run this after setting up PostgreSQL to create the database and tables.
Usage: python init_db.py
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/resume_intelligence')


def test_postgres_connection():
    """Test if PostgreSQL is running and accessible"""
    print("Testing PostgreSQL connection...")
    
    try:
        # Try to connect to default postgres database
        default_url = DATABASE_URL.rsplit('/', 1)[0] + '/postgres'
        engine = create_engine(default_url, connect_args={'connect_timeout': 5})
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"✓ PostgreSQL is running: {version.split(',')[0]}")
            return True
    
    except Exception as e:
        print(f"✗ PostgreSQL connection failed: {str(e)}")
        print("\nMake sure PostgreSQL is running:")
        print("  - Windows: Start PostgreSQL service")
        print("  - macOS: brew services start postgresql")
        print("  - Linux: sudo systemctl start postgresql")
        return False


def create_database():
    """Create the database if it doesn't exist"""
    
    db_name = DATABASE_URL.split('/')[-1]
    base_url = DATABASE_URL.rsplit('/', 1)[0]
    
    print(f"\nChecking database: {db_name}")
    
    engine = create_engine(base_url + '/postgres')
    
    try:
        with engine.connect() as conn:
            # Disable autocommit for DDL
            conn.execute(text("COMMIT"))
            
            # Check if database exists
            result = conn.execute(
                text(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
            )
            
            if result.fetchone():
                print(f"✓ Database '{db_name}' already exists")
                return True
            
            # Create database
            print(f"Creating database: {db_name}")
            conn.execute(text(f"CREATE DATABASE {db_name}"))
            conn.commit()
            print(f"✓ Database '{db_name}' created successfully")
            return True
    
    except Exception as e:
        print(f"✗ Error creating database: {str(e)}")
        return False
    
    finally:
        engine.dispose()


def create_tables():
    """Create all tables"""
    print(f"\nCreating tables...")
    
    try:
        from app.app import create_app
        from app.extensions import db
        
        app = create_app()
        
        with app.app_context():
            # Create all tables
            db.create_all()
            
            # Verify tables were created
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            print(f"✓ Tables created successfully")
            print(f"  Tables: {', '.join(tables)}")
            
            # Show table details
            for table in tables:
                columns = inspector.get_columns(table)
                print(f"    - {table}: {len(columns)} columns")
            
            return True
    
    except Exception as e:
        print(f"✗ Error creating tables: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def verify_database():
    """Verify database setup is complete"""
    print(f"\nVerifying database setup...")
    
    try:
        from app.app import create_app
        
        app = create_app()
        
        with app.app_context():
            from app.extensions import db
            
            # Test connection
            result = db.session.execute(text("SELECT 1"))
            result.scalar()
            
            # Count tables
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            expected_tables = {'users', 'resumes', 'analysis_results', 'career_roadmaps'}
            found_tables = set(tables)
            
            if expected_tables.issubset(found_tables):
                print(f"✓ All required tables exist")
                print(f"✓ Database verification passed")
                return True
            else:
                missing = expected_tables - found_tables
                print(f"✗ Missing tables: {missing}")
                return False
    
    except Exception as e:
        print(f"✗ Database verification failed: {str(e)}")
        return False


def main():
    """Main initialization flow"""
    print("\n" + "="*60)
    print("Resume Intelligence Platform - Database Setup")
    print("="*60)
    
    # Check PostgreSQL
    if not test_postgres_connection():
        sys.exit(1)
    
    # Create database
    if not create_database():
        sys.exit(1)
    
    # Create tables
    if not create_tables():
        sys.exit(1)
    
    # Verify setup
    if not verify_database():
        sys.exit(1)
    
    print("\n" + "="*60)
    print("✓ Database initialization complete!")
    print("="*60)
    print("\nNext steps:")
    print("1. Verify .env file has correct DATABASE_URL")
    print("2. Run the backend: python run.py")
    print("3. Test API: http://localhost:5000/api/health")
    print("\nDocumentation:")
    print("- API Testing: see API_TESTING_GUIDE.md")
    print("- Database Setup: see DATABASE_SETUP.md")
    print("="*60 + "\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
