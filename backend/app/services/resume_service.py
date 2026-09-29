import os
import pdfplumber
import re
from typing import Tuple, Optional


class ResumeProcessingService:
    """Service for processing and extracting text from PDF resumes"""
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Optional[str]:
        """
        Extract text from PDF file
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text or None if error
        """
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    @staticmethod
    def validate_pdf_file(file_path: str) -> bool:
        """
        Validate if file is a valid PDF
        
        Args:
            file_path: Path to file
            
        Returns:
            True if valid PDF, False otherwise
        """
        try:
            with pdfplumber.open(file_path) as pdf:
                return len(pdf.pages) > 0
        except Exception:
            return False
    
    @staticmethod
    def save_uploaded_file(file, upload_folder: str, filename: str) -> str:
        """
        Save uploaded file to disk
        
        Args:
            file: File object from Flask request
            upload_folder: Folder to save to
            filename: Filename to save as
            
        Returns:
            Path to saved file
        """
        try:
            os.makedirs(upload_folder, exist_ok=True)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            return file_path
        except Exception as e:
            raise Exception(f"Error saving file: {str(e)}")
    
    @staticmethod
    def generate_safe_filename(original_filename: str, user_id: int) -> str:
        """
        Generate safe filename for storage
        
        Args:
            original_filename: Original filename from upload
            user_id: User ID
            
        Returns:
            Safe filename
        """
        import uuid
        name, ext = os.path.splitext(original_filename)
        # Remove special characters
        name = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
        unique_id = str(uuid.uuid4())[:8]
        return f"user_{user_id}_{name}_{unique_id}{ext}"
