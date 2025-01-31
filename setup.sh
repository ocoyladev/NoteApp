#!/bin/bash

# Configuración
DB_USER="root"
DB_PASSWORD="4152963125"
DB_NAME="notes_db"
GITHUB_REPO_URL="https://github.com/ocoyladev/NoteApp.git"  
FRONTEND_PORT=4000
BACKEND_PORT=3000

USER_EMAIL="user@try.me"
USER_PASSWORD="\$2a\$10\$TO9Dm3ImsgTLyxmMFUFUl.MKNOH0yUXQxrTzJ12N7w8KJxrJYJQEi"

# Detectar sistema operativo
OS=$(uname -s)

# Verificar y instalar dependencias
install_if_missing() {
    if ! command -v "$1" &> /dev/null; then
        echo "⚠️ $1 no encontrado. Instalando..."
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
                    echo "❌ Homebrew no encontrado. Instálalo manualmente: https://brew.sh/"
                    exit 1
                fi
                ;;
            *)
                echo "❌ Sistema operativo no soportado."
                exit 1
                ;;
        esac
    else
        echo "✅ $1 ya está instalado."
    fi
}

echo "🔍 Verificando dependencias..."
install_if_missing git git
install_if_missing node node
install_if_missing npm npm
install_if_missing mysql mysql-server
install_if_missing npx node

# Clonar repositorio si no existe
if [ ! -d "./.git" ]; then
    echo "🔄 Clonando repositorio desde GitHub..."
    git clone "$GITHUB_REPO_URL" .
fi

# Configurar la base de datos
echo "🛠 Configurando base de datos MySQL..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Crear tabla user si no existe e insertar usuario
echo "👤 Creando usuario por defecto..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
INSERT IGNORE INTO user (email, password) VALUES ('$USER_EMAIL', '$USER_PASSWORD');
EOF

echo "✅ Usuario por defecto creado."

# Instalar dependencias y ejecutar backend
echo "🚀 Instalando y ejecutando el backend..."
cd backend || exit
npm install
npm run start &  # Ejecutar en segundo plano
cd ..

# Instalar dependencias y ejecutar frontend
echo "🌐 Instalando y ejecutando el frontend..."
cd frontend || exit
npm install
npm run dev -- --port $FRONTEND_PORT &  # Ejecutar en segundo plano
cd ..

# Abrir puertos
echo "🌍 Configurando firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow $BACKEND_PORT
    sudo ufw allow $FRONTEND_PORT
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --add-port=$BACKEND_PORT/tcp --permanent
    sudo firewall-cmd --add-port=$FRONTEND_PORT/tcp --permanent
    sudo firewall-cmd --reload
fi

echo "✅ Aplicación en ejecución."
echo "📌 Backend: http://localhost:$BACKEND_PORT"
echo "📌 Frontend: http://localhost:$FRONTEND_PORT"
