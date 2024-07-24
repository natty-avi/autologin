#!/bin/bash

# Git repository URL
git_repo_url="https://github.com/natty-avi/autologin.git"

# Function to install Node.js and npm
install_node() {
    echo "Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js and npm installed successfully."
}

# Function to install PostgreSQL
install_postgresql() {
    echo "Installing PostgreSQL..."
    sudo apt-get install -y postgresql postgresql-contrib
    echo "PostgreSQL installed successfully."
}

# Function to create PostgreSQL database and user
create_database() {
    echo "Creating PostgreSQL database and user..."
    sudo -u postgres psql -c "CREATE DATABASE $db_name;"
    sudo -u postgres psql -c "CREATE USER $db_user WITH ENCRYPTED PASSWORD '$db_password';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;"
    sudo -u postgres psql -c "ALTER USER $db_user WITH SUPERUSER;"
    echo "PostgreSQL database and user created successfully."
}

# Function to clone the Git repository
clone_repository() {
    echo "Cloning Git repository..."
    if [ -d "project" ]; then
        echo "Removing existing project directory..."
        rm -rf project
    fi
    git clone $git_repo_url project
    cd project
    echo "Repository cloned successfully."
}

# Function to setup backend
setup_backend() {
    echo "Setting up backend..."
    cd backend
    if [ ! -f "package.json" ]; then
        echo "Error: package.json not found in backend directory."
        exit 1
    fi
    npm install
    npm audit fix --force

    # Create .env if it does not exist
    if [ ! -f ".env" ]; then
        echo "Creating .env in backend directory."
        cat <<EOL >.env
DB_USER=$db_user
DB_HOST=$db_host
DB_NAME=$db_name
DB_PASSWORD=$db_password
DB_PORT=5432
JWT_SECRET=$jwt_secret
EOL
    fi

    # Run database migrations
    node -e "
    const { Pool } = require('pg');
    const bcrypt = require('bcryptjs');
    require('dotenv').config();
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    (async () => {
        const client = await pool.connect();
        try {
            await client.query(\`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL
                );
                CREATE TABLE IF NOT EXISTS partners (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    login_url VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    UNIQUE(name, login_url)
                );
            \`);
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await client.query(
                \`INSERT INTO users (username, password, role) VALUES ('admin', '\${hashedPassword}', 'admin') ON CONFLICT (username) DO NOTHING\`
            );
            console.log('Default admin user created with username: admin and password: admin123');
        } catch (err) {
            console.error(err);
        } finally {
            client.release();
        }
        pool.end();
    })();
    "

    cd ..
    echo "Backend setup completed."
}

# Function to setup frontend
setup_frontend() {
    echo "Setting up frontend..."
    cd frontend
    if [ ! -f "package.json" ]; then
        echo "Error: package.json not found in frontend directory."
        exit 1
    fi
    npm install --legacy-peer-deps
    npm audit fix --force

    # Create .env if it does not exist
    if [ ! -f ".env" ]; then
        echo "Creating .env in frontend directory."
        cat <<EOL >.env
REACT_APP_API_URL=$api_url
REACT_APP_OTHER_VARIABLE=your_value
EOL
    fi

    cd ..
    echo "Frontend setup completed."
}

# Function to start the backend and frontend servers
start_servers() {
    echo "Starting backend server..."
    cd backend
    nohup npm start &> backend.log &
    cd ..

    echo "Starting frontend server..."
    cd frontend
    nohup npm start &> frontend.log &
    cd ..

    echo "Servers started successfully."
}

# Function to display access details
display_access_details() {
    echo "Setup completed successfully. You can log in using the following credentials:"
    echo "Admin Username: admin"
    echo "Admin Password: admin123"
    echo "Access the frontend at: http://$server_ip:3000"
    echo "Access the backend at: http://$server_ip:5000"
}

# Main function
main() {
    # Prompt user for database connection details
    read -p "Enter PostgreSQL database name: " db_name
    read -p "Enter PostgreSQL database user: " db_user
    read -p "Enter PostgreSQL database password: " db_password
    read -p "Enter PostgreSQL host (default: localhost): " db_host
    db_host=${db_host:-localhost}

    # Prompt user for API URL
    read -p "Enter API URL (default: http://localhost:5000): " api_url
    api_url=${api_url:-http://localhost:5000}

    # Generate JWT secret
    jwt_secret=$(openssl rand -base64 32 | tr -d '\n')

    # Get server IP address
    server_ip=$(hostname -I | awk '{print $1}')

    install_node
    install_postgresql
    create_database
    clone_repository
    setup_backend
    setup_frontend
    start_servers
    display_access_details
}

# Run main function
main
