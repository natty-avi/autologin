# Travel Company Automation

## Overview
This project aims to automate the process of logging in to various partner websites for a travel company. The application has two main roles: Admin and Agent. Admins can manage partner credentials, while agents can log in to partner websites without seeing the credentials.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Automation**: Puppeteer
- **Authentication**: JWT

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/travel-company-automation.git
    cd travel-company-automation/backend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Create `.env` file**:
    ```sh
    touch .env
    ```

    Add the following content to `.env`:
    ```
    DATABASE_URL=your_postgresql_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

4. **Run the server**:
    ```sh
    npm start
    ```

### Frontend Setup

1. **Navigate to the frontend directory**:
    ```sh
    cd ../frontend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Run the frontend server**:
    ```sh
    npm start
    ```

### Usage

1. **Register as an Admin**:
    - Access the registration endpoint via Postman or any API client to create an admin user.

    ```http
    POST http://localhost:5000/api/auth/register
    {
        "username": "admin",
        "password": "password",
        "role": "admin"
    }
