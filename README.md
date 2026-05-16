========================================================
           TASK MANAGEMENT SYSTEM - README
========================================================

PROJECT DESCRIPTION
-------------------
This is a Full Stack Task Management System built using:
- Frontend: React.js (Node 22)
- Backend: Django REST Framework (Python 3.12.10)
- Database: PostgreSQL (15 or 17)
- Authentication: JWT (Access + Refresh Token)
- Role Based Access: Admin / User

========================================================
TECH STACK
========================================================
Frontend:
- React.js
- Redux / Redux-Saga
- Axios
- Node.js v22

Backend:
- Python 3.12.10
- Django / Django REST Framework
- JWT Authentication

Database:
- PostgreSQL 15 or 17

========================================================
PROJECT SETUP
========================================================

--------------------------------------------------------
1. BACKEND SETUP (DJANGO)
--------------------------------------------------------

Step 1: Create Virtual Environment
-----------------------------------
python -m venv venv

Activate Virtual Environment:

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate


--------------------------------------------------------
Step 2: Install Dependencies
--------------------------------------------------------
pip install -r requirements.txt


--------------------------------------------------------
Step 3: Configure Database (PostgreSQL)
--------------------------------------------------------

Create database:

DB Name:
test_db

PostgreSQL Version:
15 or 17

Update your settings.py:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


--------------------------------------------------------
Step 4: Run Migrations
--------------------------------------------------------
python manage.py makemigrations
python manage.py migrate


--------------------------------------------------------
Step 5: Create Super Admin (Static Admin)
--------------------------------------------------------

Admin Credentials (Static):
Email: admin@gmail.com
Password: admin123

This admin will be auto-created on first login OR can be inserted manually.

--------------------------------------------------------
Step 6: Run Backend Server
--------------------------------------------------------
python manage.py runserver

Backend will run at:
http://127.0.0.1:8000/


========================================================
2. FRONTEND SETUP (REACT)
========================================================

Step 1: Install Dependencies
--------------------------------------------------------
npm install --legacy-peer-deps


--------------------------------------------------------
Step 2: Run Frontend
--------------------------------------------------------
npm start


Frontend will run at:
http://localhost:3000/


========================================================
FEATURES
========================================================

ADMIN FEATURES:
- Login
- Create Users
- View All Users
- Create Tasks
- Assign Tasks to Users
- View All Tasks
- View Task Summary (Pending / In Progress / Completed)
- View Priority Stats

USER FEATURES:
- Login
- View Assigned Tasks
- Update Task Status
- View Task Details

========================================================
AUTHENTICATION
========================================================
- JWT Access Token used
- Refresh Token supported
- Token stored in frontend (sessionStorage/localStorage)
- Protected APIs for all routes

========================================================
DEFAULT ADMIN LOGIN
========================================================
Email: admin@gmail.com
Password: admin123

========================================================
API BASE URL
========================================================
http://127.0.0.1:8000/api/

========================================================
IMPORTANT NOTES
========================================================
- Always activate virtual environment before backend run
- Make sure PostgreSQL service is running
- Use correct DB credentials in settings.py
- Use "npm install --legacy-peer-deps" for frontend setup
- Admin must exist before creating users/tasks

========================================================
PROJECT STATUS
========================================================
✔ Login System
✔ Role Based Access
✔ Task CRUD
✔ User Management
✔ Dashboard Analytics

========================================================
THANK YOU
========================================================