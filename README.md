# autologin

#Login automation Application

## Overview

This application is designed to automate login process. It consists of a frontend built with React.js and a backend built with Node.js and Express.js. The application uses PostgreSQL as the database and Puppeteer for automating login to partner websites.

## Features

- Admin panel to add and manage partner websites.
- Agent dashboard to log in and can access all websites.
- Secure storage of login credentials.
- Responsive design using Bootstrap.

## Prerequisites

- Node.js and npm
- PostgreSQL

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travel-booking-management

### 2. Run the Setup Script
chmod +x setup.sh
./setup.sh

### 3.Configuration
The setup script will prompt you for the following information:

PostgreSQL database name
PostgreSQL database user
PostgreSQL database password
PostgreSQL host (default: localhost)

### 4.Start the Application

cd backend
npm start

cd frontend
npm start

### 5. Access the Application
Admin Panel: http://localhost:3000
Agent Dashboard: http://localhost:3000/agent

Deployment
For production deployment, ensure to secure sensitive data, use HTTPS, and configure proper server security settings.


Troubleshooting
If you encounter any issues, please check the logs for detailed error messages and ensure that all prerequisites are installed correctly.

License
This project is licensed under the MIT License.


With these steps and updates, the application should now be fully responsive, and the setup process is automated for ease of deployment.

