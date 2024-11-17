# Monorepo: GoTiny - Backend + Next.js Frontend

This monorepo hosts a Go backend and a Next.js frontend application. Both services are managed with Turborepo and Docker Compose for efficient development and deployment workflows.

---

## 📁 Project Structure

monorepo/
├── backend/       # Go backend application
├── frontend/      # Next.js frontend application
├── docker-compose.yml
└── turbo.json     # Turborepo configuration

---

## 🛠 Setup Instructions

### 1. Prerequisites
- Install [Docker](https://www.docker.com/).
- Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
- Install [Go](https://golang.org/).

---

### 2. Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd monorepo
   ```

2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Initialize the Go backend:
   ```bash
   cd ../backend
   go mod tidy
   ```

---

### 3. Running the Application

#### Using Docker Compose
1. Build and start the services:
   ```bash
   docker-compose up --build
   ```

2. Access the services:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:8080](http://localhost:8080)

---

## 🚀 Turborepo Setup

### Install Turborepo
   ```bash
   npm install -g turbo
   ```

### Turbo Commands
- **Build all projects**:
  ```bash
  turbo run build
  ```

- **Develop all projects**:
  ```bash
  turbo run dev
  ```

- **Test all projects**:
  ```bash
  turbo run test
  ```

---

## 🐳 Docker Compose

This monorepo uses Docker Compose to manage the backend and frontend services. See the [`docker-compose.yml`](./docker-compose.yml) file for configuration.

---

## 🤝 Contributions

Feel free to contribute by opening a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
```
