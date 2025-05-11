Ecommerce Ziko
Ecommerce Ziko is a Django-based e-commerce web application that allows users to register, log in, browse products, manage a cart, place orders, and update their profile. The project uses Django REST Framework for the backend API, Simple JWT for authentication, and Tailwind CSS for styling the frontend. The application is designed to provide a seamless shopping experience with features like product reviews, order tracking, and user profile management.
Table of Contents

Features
Technologies
Project Structure
Setup Instructions
Usage
Current Issues and Fixes
Contributing
License

Features

User Authentication: Register, log in, and log out using JWT-based authentication.
Profile Management: View and update user profile details (name, email, password).
Product Browsing: Search and view products with pagination, including details like price, rating, and reviews.
Cart Management: Add/remove items to/from the cart, stored in local storage.
Order Placement: Place orders with shipping details and payment method.
Order History: View past orders.
Product Reviews: Submit and view reviews for products.
Responsive Design: Frontend styled with Tailwind CSS for a modern, mobile-friendly UI.

Technologies

Backend:
Django 4.2.11
Django REST Framework
Django Simple JWT for authentication
SQLite (default database)


Frontend:
HTML templates with Django template engine
Tailwind CSS (via CDN)
Vanilla JavaScript for dynamic functionality


Tools:
Python 3.8+
pip for package management
Django's collectstatic for static files



Project Structure
ecommerceziko/
├── base/                    # Django app for core functionality
│   ├── migrations/          # Database migrations
│   ├── templates/base/      # HTML templates for frontend
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
├── ecommerceziko/           # Django project settings
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
├── static/                  # Static files (CSS, JS)
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── scripts.js
├── staticfiles/             # Collected static files for production
├── templates/               # Base and shared templates
│   ├── base.html
│   ├── login.html
│   ├── profile.html
│   ├── register.html
│   └── ... (other templates)
├── db.sqlite3               # SQLite database
├── manage.py                # Django management script
├── README.md                # Project documentation

Setup Instructions
Follow these steps to set up and run the project locally.
Prerequisites

Python 3.8 or higher
pip
Git (optional, for cloning the repository)
A modern web browser (e.g., Chrome, Firefox)

Installation

Clone the Repository (if applicable):
git clone <repository-url>
cd ecommerceziko


Create a Virtual Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies:
pip install django==4.2.11 djangorestframework djangorestframework-simplejwt


Apply Migrations:Navigate to the project directory (F:\Amit Python\third project django graduation project\ecommerceziko) and run:
python manage.py makemigrations
python manage.py migrate


Collect Static Files:
python manage.py collectstatic

This copies static files (e.g., static/js/scripts.js) to staticfiles/.

Create a Superuser (optional, for admin access):
python manage.py createsuperuser

Follow prompts to set up an admin user.

Run the Development Server:
python manage.py runserver

The application will be available at http://127.0.0.1:8000/.


Directory Setup
Ensure the following files are in place:

ecommerceziko/settings.py: Django settings with static file configuration.
templates/base.html: Base template with navigation and scripts.
templates/login.html: Login page template.
templates/profile.html: Profile page template.
static/js/scripts.js: JavaScript for authentication, profile, and other functionality.

Usage

Access the Application:Open http://127.0.0.1:8000/ in a browser.

Register:

Navigate to http://127.0.0.1:8000/register/.
Enter name, email, and password (e.g., name: "Zikovic", email: "zikovic@gmail.com", password: "123456").
Redirects to /profile/ on success.


Log In:

Go to http://127.0.0.1:8000/login/.
Enter credentials (e.g., email: "zikovic@gmail.com", password: "123456").
Redirects to /profile/ on success.


Manage Profile:

At http://127.0.0.1:8000/profile/, view user details (name, email, admin status).
Update name, email, or password and submit. A success message ("Profile updated") appears on success.


Browse Products:

Visit http://127.0.0.1:8000/products/ to view paginated products.
Search products or view details at /product/<id>/.


Manage Cart and Orders:

Add products to the cart from the products page.
View cart at /cart/ and place orders at /orders/.


Admin Panel:

Access http://127.0.0.1:8000/admin/ with superuser credentials to manage users, products, and orders.



Current Issues and Fixes

Issue: On the profile page (/profile/), the error "Error: JavaScript not loaded. Please refresh the page." appears, and the console shows scripts.js failed to load or checkAuth is not defined.

Cause: A race condition where profile.html’s inline script runs before scripts.js loads, despite using <script defer> in base.html.
Fix Applied:
Moved <script defer src="/static/js/scripts.js?v=5"> to <head> in base.html to load earlier.
Wrapped profile.html and login.html inline scripts in DOMContentLoaded event listeners to delay execution until scripts.js loads.
Removed redundant checkAuth call in base.html to simplify script dependencies.


Verification:
Ensure scripts.js loads (http://127.0.0.1:8000/static/js/scripts.js?v=5).
Check console for Scripts.js loaded, Checking auth status, Profile script running, Loading profile.
Confirm <p id="profile-message"> is empty or shows "Profile updated".




Tailwind CSS Warning: Console warning about cdn.tailwindcss.com not being suitable for production.

Note: Safe to ignore in development (DEBUG = True). For production, install Tailwind CLI or use PostCSS (see Tailwind Installation).



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

Please ensure code follows PEP 8 for Python and includes comments for clarity.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact: For issues or questions, contact the project maintainer at [your-email@example.com].
