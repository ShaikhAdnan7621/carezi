# Carezi Project Structure

Detailed file organization for the Carezi Healthcare Professional Network (Next.js 14 + MongoDB).

## 📁 Root Directory

```
carezi/
├── .env.local              				# Environment variables
├── .eslintrc.json          				# ESLint configuration
├── .gitignore              				# Git ignore rules
├── next.config.mjs         				# Next.js config (Cloudinary domains)
├── package.json            				# Dependencies & scripts
├── tailwind.config.js      				# Tailwind config (green theme)
├── README.md               				# Project overview
├── PROJECT_STRUCTURE.md    				# This file
├── requirements.md         				# Technical requirements
├── FEATURE_IMPLEMENTATION.md				# Future features TODO
├── roadmap.md              				# Development progress
├── .next/                  				# Build output (auto-generated)
├── public/                 				# Static assets
│   ├── Logo.svg            				# App logo
│   └── favicon.ico         				# Site favicon
└── src/                    				# Source code
```

## 🎯 Source Code (`src/`)

### 📱 App Router (`src/app/`)

```
app/
├── layout.js 								# Root layout
├── page.js 								# Home page
├── globals.css 							# Global styles
├── api/ 									# API Routes
│   ├── appointments/ 						# Appointment system
│   │   ├── route.js 						# CRUD operations
│   │   ├── [id]/route.js 					# Individual appointment
│   │   ├── [id]/review/route.js 			# Professional review
│   │   ├── professional/my/route.js		# My appointments
│   │   ├── professional/my/stats/route.js 	# Statistics
│   │   └── calendar/[professionalId]/route.js # Calendar data
│   ├── affiliation/ 						# Affiliation system
│   │   ├── route.js						# Create requests
│   │   ├── [id]/route.js					# Individual operations
│   │   ├── manage/route.js					# Bulk operations
│   │   ├── organization/my/route.js		# Org applications
│   │   └── professional/my/route.js		# Prof applications
│   ├── auth/								# Authentication
│   │   ├── login/route.js
│   │   ├── register/route.js
│   │   └── logout/route.js
│   ├── organizations/route.js				# Organization management
│   ├── professionals/route.js				# Professional management
│   └── uploadimage/route.js				# Cloudinary upload
├── organizations/							# Organization pages
│   ├── page.js								# Directory
│   ├── my/affiliations/page.js				# Application management
│   ├── my/appointments/page.js				# Appointment management
│   └── profile/[id]/page.js				# Public profile
├── professional/							# Professional pages
│   ├── page.js								# Directory
│   ├── my/affiliations/page.js				# My applications
│   ├── my/appointments/page.js				# My appointments
│   └── profile/[id]/page.js				# Public profile
├── auth/									# Auth pages
│   ├── login/page.js
│   ├── signup/page.js
│   └── logout/page.js
└── cear/									# Content system
    ├── feed/page.js
    ├── my/page.js
    └── [id]/page.js
```

### 🧩 Components (`src/components/`)

```
components/
├── appointments/							# Appointment system
│   ├── AppointmentCard.jsx					# Compact display
│   ├── AppointmentDetailsDialog.jsx		# Full details
│   ├── AppointmentActionDialog.jsx			# Review interface
│   ├── organization/
│   │   ├── OrganizationAppointmentCalendar.jsx # Org calendar
│   │   └── OrganizationTimePickerDialog.jsx    # Org booking
│   └── professional/
│       ├── ProfessionalAppointmentCalendar.jsx # Prof calendar
│       └── ProfessionalTimePickerDialog.jsx    # Prof booking
├── affiliation/							# Affiliation system
│   ├── JoinOrganizationDialog.jsx			# Multi-step form
│   ├── ApplicationReviewDialog.jsx			# Review interface
│   ├── ReviewRequestDialog.jsx				# Simple review
│   └── ProfessionalCard.jsx				# Profile cards
├── ui/										# Shadcn/UI base components
│   ├── button.jsx							# Button variants
│   ├── card.jsx							# Card layouts
│   ├── dialog.jsx							# Modal dialogs
│   ├── input.jsx							# Form inputs
│   ├── select.jsx							# Dropdowns
│   ├── badge.jsx							# Status badges
│   └── loading.jsx							# Loading states
├── cear/									# Content system
├── pageComponents/							# Page-specific
│   ├── layout/
│   ├── organizationprofile/
│   ├── professionalprofile/
│   └── user/
└── skeleton/								# Loading skeletons
```

### 🗄️ Database Models (`src/models/`)

```
models/
├── usermodles.js							# Base user accounts
├── professionalmodles.js					# Healthcare professionals + consultation hours
├── organizationmodles.js					# Healthcare organizations
├── appointmentModel.js						# Appointment system
├── appointment/
│   └── appointmentmodles.js 				# Alternative schema
├── affiliationRequestModel.js 				# Application requests
├── affiliationModel.js     				# Active affiliations
└── cear/                   				# Content system models
```

**Relationships:**
- Users ↔ Professionals/Organizations (1:1)
- Professionals ↔ Appointments (1:Many)
- Organizations ↔ Appointments (1:Many)
- Professionals ↔ Organizations (Many:Many via Affiliations)

### 🛠️ Utilities (`src/lib/` & `src/utils/`)

```
lib/
├── dbConnect.js							# MongoDB connection
├── utils.js								# General utilities
├── cloudinary.js							# Image upload config
└── validations/							# Schema validations

utils/
├── getUserFromCookies.js					# Cookie authentication
├── generateToken.js						# Token generation
├── hashpassword.js							# Password hashing
└── getAdminFromCookies.js					# Admin authentication
```

## 🔥 Key Features

**Appointment System:**
- Dual booking workflows (direct/organization)
- Interactive calendars with availability
- Multi-status workflow (request → review → complete)
- Priority scheduling (routine/urgent/emergency)

**Affiliation System:**
- Employee type classification (new/existing)
- Multi-step applications with validation
- Dual review interfaces (comprehensive/simple)
- Real-time status tracking

**Security & UI:**
- Cookie-based authentication
- Role-based access control
- Responsive design with green theme
- Shadcn/ui component library

## 📋 Configuration

| File | Purpose |
|------|----------|
| `next.config.mjs` | Next.js + Cloudinary domains |
| `tailwind.config.js` | Green theme + breakpoints |
| `.eslintrc.json` | Linting rules |
| `components.json` | Shadcn/ui config |
| `middleware.js` | Route protection |

## 🔧 Environment & Tech Stack

**Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/carezi
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Technology Stack:**
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Next.js API Routes, MongoDB, Mongoose
- UI: Shadcn/ui, Lucide React, React Quill
- Auth: Cookie-based sessions, JWT
- Storage: Cloudinary (images), MongoDB (data)
- Validation: Zod schemas
- Notifications: Sonner toasts

## 🏗️ Development Patterns

**File Naming:**
- Components: PascalCase (`ProfessionalCard.jsx`)
- Pages: lowercase (`page.js`)
- API Routes: lowercase (`route.js`)
- Utilities: camelCase (`getUserFromCookies.js`)

**Code Patterns:**
```javascript
// Component exports
export default function ComponentName() { }

// API routes
export async function GET(request) { }
export async function POST(request) { }

// Models
export default mongoose.models.ModelName || mongoose.model('ModelName', schema)
```

**Development Workflow:**
1. Feature → `components/feature-name/`
2. API → `app/api/feature-name/`
3. Pages → `app/feature-name/`
4. Models → `models/`
5. Utils → `utils/`