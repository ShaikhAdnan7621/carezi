
---

# Carezi Project Roadmap 

## Overview
Carezi is a professional network for medical and healthcare professionals. The application allows users to apply for a profession, verify their details, and create a professional profile. It supports features like user authentication, profession verification, professional profiles, document upload, and more. The project will follow a full-stack development approach with React on the frontend and MongoDB with Mongoose for the backend.

## Phase 1: Project Setup

### 1.1 Set up the Development Environment
- Install Node.js and npm (Node Package Manager). ✅
- Set up a GitHub repository for version control. ✅
- Set up your IDE (Visual Studio Code, etc.). ✅
- Initialize the project with `npm init` and create a basic  file structure: ✅
  - **Backend**: Node.js, Express.js, MongoDB (via Mongoose)
  - **Frontend**: React, JSX, TailwindCSS (optional for styling)

### 1.2 Install Required Libraries
Backend:
- Express.js: `npm install express` ✅
- Mongoose: `npm install mongoose` ✅
- JWT (for token-based authentication): `npm install jsonwebtoken` ✅
- Bcrypt (for password hashing): `npm install bcryptjs` ✅
- Multer (for file upload handling): `npm install multer` ✅
  
Frontend:
- React: `npx create-react-app carezi-frontend` ✅ 
- Axios (for making HTTP requests): `npm install axios` ✅
- React Router (for routing): `npm install react-router-dom` ✅

---

## Phase 2: Backend Development

### 2.1 User Authentication
- Create the `userSchema` with fields such as name, email, password, etc. ✅
- Implement JWT-based authentication: 
  - Register and log in routes.
  - Secure routes using JWT tokens (using middleware to verify tokens).
- Implement password hashing using `bcrypt`. ✅

### 2.2 Profession Verification
- Add an `applyProfession` field in the user schema to track whether the user has applied for a profession and whether the application is pending, approved, or rejected. ✅
- Add a `verificationDocuments` array to store uploaded verification files (e.g., medical licenses, certificates). 
- Implement an admin verification workflow: ✅
  - Create admin routes to approve or reject user applications. ✅
  - Create a professional profile once the user is approved. ✅

### 2.3 Professional Profile Schema
- Create a `professionalSchema` with fields such as: ✅
  - `professionType`, `profileSummary`, `education`, `skills`, `experience`, `certifications`, `projects`, and `consultationDetails`.
  - Link the `userSchema` to the `professionalSchema` by using ObjectIds. ✅

### 2.4 User Profile Management
- Allow users to update their profile, including details like contact information, social media links, education, skills, certifications, etc. ✅
- Allow users to upload files (e.g., certificates or CVs) and store URLs or paths in the database. ✅

### 2.5 Admin Dashboard
- Implement an admin dashboard where admins can review and approve/reject profession applications.
- Include a list of users and their profession verification status. ✅

---

## Phase 3: Frontend Development

### 3.1 Setting Up React Frontend
- Set up React Router to handle navigation between different pages (e.g., home, profile, login, signup, admin). ✅
- Create basic components: `Header`, `Footer`, `LoginForm`✅, `SignupForm`✅, `ProfilePage` ✅ , `AdminDashboard`, etc.
- Set up the basic structure of your frontend using JSX and styling libraries (like TailwindCSS).

### 3.2 User Authentication on Frontend
- Implement the user login and signup forms. ✅
- Use Axios to send requests to the backend to register, log in, and verify users. ✅
- Store the JWT token in local storage or session storage for persistent login sessions. ✅
- Redirect the user to the profile page after login. ✅

### 3.3 Profile Management Interface
- Allow users to fill in their professional profile (education, skills, experience, certifications, etc.) via forms. ✅
- Allow users to upload files (e.g., certificates) using a file input field and send the files to the backend. ✅
- Display a preview of the profile after submission. ✅

### 3.4 Admin Dashboard UI
- Create a user-friendly admin dashboard where admins can review user applications, view uploaded verification documents, and approve or reject profession applications.
- Display user status (pending/approved/rejected) with actionable buttons to update the status.
- Use Axios to send approval/rejection requests to the backend.

---

## Phase 4: File Upload Implementation

### 4.1 Backend File Upload
- Use Multer to handle file uploads in the backend.
- Store files locally or on cloud services (e.g., AWS S3, Google Cloud Storage).
- Ensure the file names are unique to avoid collisions and handle potential errors.
- Store the file paths or URLs in the `verificationDocuments` array in the user schema.

### 4.2 Frontend File Upload
- Add file upload functionality in the React frontend (e.g., using an `<input type="file">`).
- Allow users to upload verification documents (e.g., certificates).
- Use Axios to send the uploaded files to the backend.

---

## Phase 5: Testing

### 5.1 Unit Testing
- Write unit tests for backend API endpoints using a testing framework like Mocha or Jest.
- Test user authentication, file uploads, admin approval workflows, etc.

### 5.2 Integration Testing
- Test the full integration of the frontend and backend. Ensure data flows smoothly from the frontend to the backend (e.g., form submissions, file uploads, profile updates).
- Ensure that JWT authentication works properly with protected routes.

### 5.3 UI Testing
- Test the frontend UI to ensure it's responsive and user-friendly.
- Ensure forms, file uploads, and buttons work as expected.

---

## Phase 6: Deployment

### 6.1 Backend Deployment
- Deploy the backend to a cloud provider (e.g., Heroku, AWS, DigitalOcean).
- Set up environment variables for sensitive data (e.g., JWT secret, MongoDB URI).
- Ensure the backend is connected to the cloud database (MongoDB Atlas or another MongoDB provider).

### 6.2 Frontend Deployment
- Deploy the frontend to a static hosting platform (e.g., Netlify, Vercel).
- Set up the React build process (`npm run build`) and deploy the static assets.

### 6.3 Database Backup and Monitoring
- Set up automated backups for the database.
- Implement monitoring for the backend (e.g., using tools like New Relic, Datadog, or Heroku logs).

---

## Phase 7: Post-Launch

### 7.1 User Feedback
- Collect feedback from users and admins.
- Analyze user behavior and usage patterns to improve the application.

### 7.2 Ongoing Maintenance and Updates
- Regularly update the application with security patches, bug fixes, and new features based on feedback.
- Maintain and improve the professional verification process.

---

## Phase 8: Future Features (Optional)

### 8.1 Integration with Other Healthcare Systems
- Integrate with third-party healthcare systems (e.g., hospital systems, medical databases) to verify professional credentials.

### 8.2 Chat/Communication Feature
- Implement chat functionality for users (doctors, patients, etc.) to communicate securely.

### 8.3 Mobile App
- Create a mobile version of the app using React Native or another framework.

---
