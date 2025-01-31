#!/bin/bash

# Configuration
DB_USER="root"
DB_PASSWORD="4152963125"
DB_NAME="notes_db"
REPO_URL="https://github.com/ocoyladev/NoteApp.git"
APP_DIR="NoteApp"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
FRONTEND_PORT=4000
BACKEND_PORT=3000

# Detect OS
OS=$(uname -s)

# Function to check and install dependencies
install_if_missing() {
    if ! command -v "$1" &> /dev/null; then
        echo "⚠️ $1 not found. Installing..."
        case "$OS" in
            Linux)
                if command -v apt &> /dev/null; then
                    sudo apt update && sudo apt install -y "$2"
                elif command -v yum &> /dev/null; then
                    sudo yum install -y "$2"
                fi
                ;;
            Darwin)
                if command -v brew &> /dev/null; then
                    brew install "$2"
                else
                    echo "❌ Homebrew not found. Please install it manually: https://brew.sh/"
                    exit 1
                fi
                ;;
            *)
                echo "❌ Unsupported operating system."
                exit 1
                ;;
        esac
    else
        echo "✅ $1 is already installed."
    fi
}

echo "🔍 Checking dependencies..."
install_if_missing git git
install_if_missing node node
install_if_missing npm npm
install_if_missing mysql mysql-server
install_if_missing npx node

# Clone repository if it doesn't exist
if [ ! -d "NoteApp" ]; then
    echo "🔄 Cloning repository from GitHub..."
    git clone "$REPO_URL"
fi

# Navigate to project directory
cd "$APP_DIR" || { echo "❌ Failed to enter project directory"; exit 1; }

# 📌 Crear archivo .env en backend/
echo "📝 Creating .env file..."
cat <<EOF > "$BACKEND_DIR/.env"
DB_HOST=mysql-ocoyladev.alwaysdata.net
DB_USER=ocoyladev_free
DB_PASS=8Nwz@.nTN4g.rhc
DB_NAME=ocoyladev_noteapp
DB_PORT=3306
EOF

echo "✅ .env file created in backend!"


# Install dependencies and start backend
echo "🚀 Installing and starting backend..."
cd "$BACKEND_DIR" || { echo "❌ Failed to enter backend directory"; exit 1; }
npm install
npm run start &  # Run in the background
cd ..

# Install dependencies and start frontend
echo "🌐 Installing and starting frontend..."
cd frontend || { echo "❌ Failed to enter frontend directory"; exit 1; }
npm install
npm run dev -- --port $FRONTEND_PORT &  # Run in the background
cd ..

# Open required ports
echo "🌍 Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow $BACKEND_PORT
    sudo ufw allow $FRONTEND_PORT
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --add-port=$BACKEND_PORT/tcp --permanent
    sudo firewall-cmd --add-port=$FRONTEND_PORT/tcp --permanent
    sudo firewall-cmd --reload
fi

echo "✅ Application is running."
echo "📌 Backend: http://localhost:$BACKEND_PORT"
echo "📌 Frontend: http://localhost:$FRONTEND_PORT"
