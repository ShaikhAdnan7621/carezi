# Carezi Project Requirements

This document outlines the comprehensive requirements and dependencies for the Carezi healthcare professional network platform.

## Core Requirements

### User Authentication
- Secure registration and login system
- Cookie-based authentication
- Password hashing with bcrypt
- Role-based access control (user, professional, organization, admin)
- Password reset functionality

### User Management
- User profiles with basic information
- Profile updates and management
- Role assignment and verification

### Professional Profiles
- Detailed professional information
- Education and certification details
- Experience and skills listing
- Verification status indicators
- Document upload for verification
- Organization affiliation system

### Organization Profiles
- Healthcare facility information
- Services offered
- Location and contact details
- Verification status
- Professional application management
- Staff affiliation system

### CEAR System
- Content creation with rich text editor
- Feed display with filtering options
- Like and comment functionality
- User-specific content views

### Admin Dashboard
- User verification management
- Application review system
- Content moderation tools
- System statistics and metrics

### File Management
- Document upload for verification
- Image upload for profiles and content
- Secure storage and retrieval

## Technical Requirements

### Frontend Dependencies
#### Core
- Next.js 14 (App Router)
- React 18
 
#### UI & Styling
- Tailwind CSS
- Shadcn/ui
- React Quill (Rich Text Editor)
- Lucide Icons
- Class Variance Authority
- Clsx
- Tailwind-merge
- Sonner (Toast notifications)

#### Form Handling
- Zod (Form Validation)

### Backend Dependencies
#### Authentication & Security
- Bcryptjs (Password Hashing)
- JSON Web Token (JWT)
- Jose (JWT handling)
- Cookie-based session management

#### Database
- MongoDB
- Mongoose
- MongoDB Atlas (Cloud Database)

#### API & Data Handling
- Axios
- Next.js API Routes

#### File Handling
- Cloudinary
- Multer
- Sharp (Image processing)

## Environment Variables
```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional: Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

## Project Structure
mentioned in the project structure file


## Development Guidelines
1. Use proper error handling throughout the application
2. Follow REST API best practices
3. Implement responsive design for all pages
4. Follow security best practices for authentication and data handling
5. Write clean, maintainable code
6. Add proper documentation for API endpoints and components
7. Implement proper validation for all user inputs
8. Ensure accessibility compliance
9. Optimize performance for image loading and API requests