# Carezi - Healthcare Professional Network

A comprehensive professional network platform for medical and healthcare professionals, facilitating connections between professionals and organizations.

## 🎯 Core Features

### Authentication & User Management
- Secure cookie-based authentication with HTTP-only cookies
- Multi-role support (Professionals & Organizations)
- Comprehensive profile management

### Professional Network
- Detailed professional profiles with credentials
- Organization profiles for healthcare facilities
- Professional directory with search functionality

### Appointment System
- Dual booking workflows (direct & organization-mediated)
- Interactive calendar with availability management
- Multi-status workflow (request → review → complete)
- Priority-based scheduling (routine/urgent/emergency)

### Affiliation System
- Multi-step application process
- Employee type classification (new/existing)
- Comprehensive review interfaces
- Real-time status tracking

### Content & Communication
- CEAR system for professional interaction
- Rich text editor for content creation
- Document management and verification

## 🛠️ Technology Stack

**Frontend:** Next.js 14, React 18, Tailwind CSS, Shadcn/ui  
**Backend:** Next.js API Routes, MongoDB, Mongoose  
**Authentication:** HTTP-only cookies, JWT  
**Storage:** Cloudinary (images), MongoDB (data)  
**UI/UX:** Responsive design, Light green theme

## 📁 Project Architecture

Detailed project structure and organization → See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 

## 🧩 Key Components

**Appointment System:**
- Calendar interfaces (Professional/Organization)
- Booking dialogs with time selection
- Review and action management

**Affiliation System:**
- Multi-step application forms
- Review interfaces (comprehensive/simplified)
- Professional profile cards

**Security:**
- Cookie-based authentication
- Protected API routes
- Role-based access control

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local/cloud)
- Cloudinary account

### Installation
```bash
# Clone and install
git clone https://github.com/yourusername/carezi.git
cd carezi
npm install

# Environment setup
cp .env.example .env.local
# Add your MongoDB URI, JWT secret, and Cloudinary credentials

# Start development
npm run dev
```

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📜 Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

## 📈 Current Status

**✅ Completed Features:**
- Authentication & User Management
- Professional & Organization Profiles
- Affiliation System (Application & Review)
- Appointment System (Booking & Management)
- CEAR Content System

**🔄 In Progress:**
- Social Networking Features
- Advanced Analytics

Detailed development progress → See [roadmap.md](roadmap.md)

## 🗄️ Database Models

**Core Models:**
- Users (authentication)
- Professionals (profiles + consultation hours)
- Organizations (facility profiles)
- Appointments (booking system)
- Affiliation Requests (applications)
- Affiliations (active relationships)

**Key Relationships:**
- Users ↔ Professionals/Organizations (1:1)
- Professionals ↔ Appointments (1:Many)
- Organizations ↔ Appointments (1:Many)
- Professionals ↔ Organizations (Many:Many via Affiliations)

## 🔌 API Structure

**Authentication:** `/api/auth/*` (login, register, logout)  
**Appointments:** `/api/appointments/*` (CRUD, review, calendar)  
**Affiliations:** `/api/affiliation/*` (applications, management)  
**Users:** `/api/professionals/*`, `/api/organizations/*`  
**Upload:** `/api/uploadimage/*` (Cloudinary integration)

## 🚀 Deployment

**Recommended Platforms:**
- Vercel (Next.js optimized)
- Railway (full-stack with database)
- AWS (enterprise)

## 📋 Additional Documentation

- [Project Structure](PROJECT_STRUCTURE.md) - Detailed file organization
- [Requirements](requirements.md) - Technical requirements & dependencies
- [Feature Implementation](FEATURE_IMPLEMENTATION.md) - Future features & TODO
- [Roadmap](roadmap.md) - Development progress & milestones

## 🤝 Contributing

Contributions welcome! Please follow the project structure and coding guidelines.

## 📄 License

Copyright (c) 2024 Adnan. All Rights Reserved.
