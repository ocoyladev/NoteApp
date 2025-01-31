#!/bin/bash

# Configuración
DB_USER="root"
DB_PASSWORD="4152963125"
DB_NAME="notes_db"
GITHUB_REPO_URL="https://github.com/ocoyladev/NoteApp.git"  # Reemplaza con la URL real
FRONTEND_PORT=4000
BACKEND_PORT=3000

USER_EMAIL="user@try.me"
USER_PASSWORD="\$2a\$10\$TO9Dm3ImsgTLyxmMFUFUl.MKNOH0yUXQxrTzJ12N7w8KJxrJYJQEi"

# Verificar dependencias
echo "🔍 Verificando dependencias..."

check_command() {
    command -v "$1" >/dev/null 2>&1 || { echo "❌ $1 no está instalado. Instálalo y vuelve a ejecutar el script."; exit 1; }
}

check_command git
check_command node
check_command npm
check_command mysql
check_command npx

echo "✅ Todas las dependencias están instaladas."

# Clonar repositorio (opcional, si no está clonado)
if [ ! -d "./.git" ]; then
    echo "🔄 Clonando repositorio desde GitHub..."
    git clone "$GITHUB_REPO_URL" .
fi

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
echo "🌍 Configurando firewall (si es necesario)..."
sudo ufw allow $BACKEND_PORT
sudo ufw allow $FRONTEND_PORT

echo "✅ Aplicación en ejecución."
echo "📌 Backend: http://localhost:$BACKEND_PORT"
echo "📌 Frontend: http://localhost:$FRONTEND_PORT"