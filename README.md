README.md
# AI-Powered Job Recommendation Portal

An AI-powered Job Recommendation Portal built using **Node.js, Express.js, MongoDB, Mongoose, and JavaScript**. The system allows users to register, log in securely, create a profile with their skills and projects, and receive personalized job recommendations based on AI-driven matching logic.

## Features

- User Registration and Login
- Secure Password Encryption using Bcrypt
- Session-based Authentication
- MongoDB Database Integration
- AI-based Job Matching
- Skill-Based Recommendation System
- Project Keyword Matching
- Preloaded Job Database
- Responsive Frontend
- User Logout Functionality

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- Express Session
- Bcrypt Password Hashing

---

## Project Structure


project/

│
├── models/
│ ├── User.js
│ └── Job.js
│
├── utils/
│ └── matchingLogic.js
│
├── public/
│ ├── index.html
│ ├── login.html
│ ├── register.html
│ ├── css/
│ └── js/
│
├── server.js
├── show_users.js
├── package.json
├── package-lock.json
└── README.md


---

## Installation

### Clone the Repository

git clone https://github.com/yourusername/job-recommendation-portal.git
cd job-recommendation-portal
Install Dependencies
npm install
Required Packages

The project uses the following dependencies:

Express
Express Session
MongoDB
Mongoose
Bcrypt

These are defined in package.json.

Running MongoDB

Start your local MongoDB server.

Default Database:

jobPortal

MongoDB Connection:

mongodb://127.0.0.1:27017/jobPortal

The application automatically connects to this database during startup.

Running the Project

Start the server using:

npm start

or

node server.js

The application will run at:

http://localhost:3000

The start script is configured in package.json.

Authentication

The system supports:

User Registration
User Login
Password Hashing using Bcrypt
Session Management
Logout

Passwords are stored securely as encrypted hashes instead of plain text. Registration, login, logout, and session handling are implemented in the Express server.

AI Job Matching

The recommendation engine compares the user's:

Technical Skills
Projects
Project Keywords

with the available jobs stored in MongoDB and returns the best matching opportunities using custom matching logic. The server exposes a /match endpoint that retrieves all jobs and computes matches using the matching utility.

Default Jobs

When the application starts for the first time, it automatically inserts sample jobs if the database is empty.

Sample roles include:

Data Analyst
Prompt Engineer
Full Stack Developer
Backend Developer
AI Engineer
AI Analyst

This initialization is handled during server startup.

API Endpoints
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Login
POST	/api/logout	Logout
POST	/match	Get AI Job Recommendations

These endpoints are defined in the Express server.

Database
User Collection

Stores:

Username
Email
Encrypted Password
Registration Date
Job Collection

Stores:

Job Title
Description
Required Skills
Project Keywords

The server seeds and queries these collections through Mongoose models.

Utility Script

The project also includes:

node show_users.js

This utility connects to the jobPortal database and prints all registered users (including a preview of the encrypted password hash) for administrative purposes.

Future Enhancements
Resume Upload
PDF Resume Parsing
Machine Learning Based Recommendation
JWT Authentication
Email Verification
Admin Dashboard
Job Application Tracking
Company Portal
Resume Score Analysis
AI Chat Assistant
Author

Keerthan Malineedi

AI & Machine Learning Student

License

This project is developed for educational and learning purposes.
