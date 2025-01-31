# NoteApp

**NoteApp** is a notes application built with **NestJS (backend)** and **React (frontend)**, using **MySQL** as the database.  
This project is designed to run on **Linux/macOS** with a single command.

## 🚀 Technologies Used

- **Backend**
  - [Node.js](https://nodejs.org/) `v18.17.0`
  - [NestJS](https://nestjs.com/) `v10.x`
  - [TypeORM](https://typeorm.io/) `v0.3.x`
  - [MySQL](https://www.mysql.com/) `v8.0.x`
  
- **Frontend**
  - [React](https://react.dev/) `v18.x`
  - [Vite](https://vitejs.dev/) `v4.x`
  - [Tailwind CSS](https://tailwindcss.com/) `v3.x`

## 📂 Repository Structure

```
NoteApp/
│── backend/      # Backend code (NestJS + TypeORM + MySQL)
│── frontend/     # Frontend code (React + Vite)
│── setup.sh      # Script to set up and run the application
│── README.md     # Project documentation
```

## 📦 Prerequisites

Before running the project, ensure you have the following installed:

- **Git** `v2.x` → [Download](https://git-scm.com/)
- **Node.js** `v18.17.0` → [Download](https://nodejs.org/)
- **npm** `v9.x` (included with Node.js)
- **MySQL** `v8.0.x` → [Download](https://dev.mysql.com/downloads/)
- **npx** (included with Node.js)
- **UFW (firewall tool)** (for Linux)

## 🔧 Installation & Execution

To install and run the application, simply execute the following command in the terminal:

```bash
./setup.sh
```

This script performs the following steps:

1. Checks and installs dependencies (`git`, `node`, `mysql`, `npx`).
2. Clones the repository (if necessary).
3. Creates the .env file (backend)
5. Installs dependencies for both backend and frontend.
6. Starts both servers (`backend` and `frontend`).
7. Configures the necessary firewall ports.

### 🎯 Accessing the Application

- **Frontend (React + Vite):** [`http://localhost:4000`](http://localhost:4000)
- **Backend (NestJS API):** [`http://localhost:3000`](http://localhost:3000)

Login:
**Email:** `user@try.me`
**Password:** `P@$$word`



## 🛠 Main Backend Endpoints

| Method  | Route                | Description                         |
|---------|----------------------|-------------------------------------|
| `POST`  | `/auth/login`        | User login                         |
| `POST`  | `/auth/register`     | User registration                  |
| `GET`   | `/notes`             | Retrieve all notes                 |
| `POST`  | `/notes`             | Create a new note                  |
| `GET`   | `/tags`              | Retrieve all tags                   |

## 📌 Additional Notes

- The `synchronize: true` option in TypeORM allows automatic table creation.
- The default user (`user@try.me`) can be modified in `setup.sh`.

## 📄 License

This project is licensed under the **MIT** License.
```
