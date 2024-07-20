#!/bin/bash

# Git repository URL
git_repo_url="https://github.com/natty-avi/autologin.git"

# Function to install Node.js and npm
install_node() {
    echo "Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
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

    # Create .env.example if it does not exist
    if [ ! -f ".env.example" ]; then
        echo "Creating .env.example in backend directory."
        cat <<EOL >.env.example
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
EOL
    fi

    cp .env.example .env
    # Set JWT secret in .env file
    echo "JWT_SECRET=$jwt_secret" >> .env
    # Update .env file with database connection details
    sed -i "s/your_db_user/$db_user/g" .env
    sed -i "s/your_db_host/$db_host/g" .env
    sed -i "s/your_db_name/$db_name/g" .env
    sed -i "s/your_db_password/$db_password/g" .env

    # Fix vulnerabilities
    npm audit fix

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
    npm install

    # Create .env.example if it does not exist
    if [ ! -f ".env.example" ]; then
        echo "Creating .env.example in frontend directory."
        cat <<EOL >.env.example
REACT_APP_API_URL=http://localhost:5000
REACT_APP_OTHER_VARIABLE=your_value
EOL
    fi

    cp .env.example .env
    # Update .env file with API URL and other frontend-specific environment variables
    sed -i "s|http://localhost:5000|$api_url|g" .env

    # Fix vulnerabilities
    npm audit fix

    cd ..
    echo "Frontend setup completed."
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

    install_node
    install_postgresql
    create_database
    clone_repository
    setup_backend
    setup_frontend
    echo "Server setup completed successfully."
}

# Run main function
main
