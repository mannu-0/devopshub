# 🚀 DevOpsHub

DevOpsHub is a full-stack task management application built to demonstrate a practical **DevOps workflow** using Docker, Docker Compose, GitHub Actions, Docker Hub, Kubernetes, MongoDB, and Nginx.

The project focuses on containerization, CI automation, Kubernetes deployment, service communication, persistent storage, and reverse proxy configuration.

---

## 🏗️ Architecture

```text
                         Developer
                             │
                             ▼
                          GitHub
                             │
                             ▼
                    GitHub Actions CI
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              Backend Image     Frontend Image
                    │                 │
                    └──────┬──────────┘
                           ▼
                       Docker Hub
                           │
                           ▼
                    Kubernetes Cluster
                       (Minikube)
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
          Frontend      Backend      MongoDB
          + Nginx       Service       + PVC
              │            │            │
              │            ▼            │
              │         Node.js        │
              │            │            │
              └── /api ────┘            │
                           │             │
                           └─────────────┘
```

---

## ✨ Features

* Create tasks
* View all tasks
* Update task status
* Delete tasks
* REST API with Node.js and Express
* MongoDB database
* Dockerized frontend and backend
* Docker Compose for local multi-container setup
* Nginx reverse proxy
* Kubernetes Deployments and Services
* Kubernetes PersistentVolumeClaim for MongoDB
* Kubernetes namespace-based deployment
* GitHub Actions CI pipeline
* Docker Hub image publishing
* Kubernetes rolling deployment
* Kubernetes service discovery and internal communication

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Nginx

### Backend

* Node.js
* Express.js
* Mongoose
* REST API

### Database

* MongoDB

### DevOps

* Docker
* Docker Compose
* Kubernetes
* Minikube
* Git
* GitHub
* GitHub Actions
* Docker Hub
* Nginx

---

## 📁 Project Structure

```text
devopshub/
│
├── frontend/
│   ├── nginx/
│   │   └── default.conf
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── compose.yml
│   ├── package.json
│   └── ...
│
├── k8s/
│   ├── namespace.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   ├── mongodb-pvc.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── compose.yml
└── README.md
```

---

# 🐳 Docker Setup

The application is containerized using Docker.

### Backend Image

```text
mannu0/devopshub-backend
```

### Frontend Image

```text
mannu0/devopshub-frontend
```

The frontend uses a multi-stage Docker build:

```text
Node.js
   ↓
Install dependencies
   ↓
Build React application
   ↓
Nginx Alpine
   ↓
Serve production build
```

---

# 🐳 Docker Compose

Docker Compose is used for running the backend and MongoDB together during local development.

```text
Backend Container
       │
       ▼
MongoDB Container
```

The MongoDB data is stored using a Docker named volume so that data remains available after containers are recreated.

Example:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

Stop the stack:

```bash
docker compose down
```

> The MongoDB volume is intentionally not removed when using `docker compose down`, allowing database data to persist.

---

# ☸️ Kubernetes Deployment

The application is deployed to a local Kubernetes cluster using **Minikube**.

## Namespace

All application resources are deployed inside:

```text
devopshub
```

Create the namespace:

```bash
kubectl apply -f k8s/namespace.yaml
```

---

## MongoDB

MongoDB runs as a Kubernetes Deployment with a PersistentVolumeClaim.

```text
MongoDB Pod
    │
    ▼
MongoDB Service
    │
    ▼
PersistentVolumeClaim
```

The PVC provides persistent storage for MongoDB data.

Check PVC:

```bash
kubectl get pvc -n devopshub
```

---

## Backend

The backend runs as a Kubernetes Deployment.

Backend:

```text
Node.js + Express
Port: 5000
```

The backend connects to MongoDB using the Kubernetes service name:

```text
mongodb:27017
```

Backend Service:

```text
backend:5000
```

Health endpoint:

```text
/api/health
```

Example response:

```json
{
  "status": "healthy",
  "service": "backend"
}
```

---

## Frontend

The frontend is served through Nginx on port 80.

The frontend Kubernetes Service is exposed using NodePort.

Nginx handles requests for the frontend and forwards API requests to the backend:

```text
/api/*
   ↓
Nginx
   ↓
backend:5000
```

This allows the browser to use the same origin for frontend and API requests.

---

# 🔄 CI Pipeline

GitHub Actions is used to automatically build and publish Docker images.

Pipeline flow:

```text
Git Push
   ↓
GitHub Actions
   ↓
Checkout Repository
   ↓
Docker Hub Login
   ↓
Build Backend Image
   ↓
Push Backend Image
   ↓
Build Frontend Image
   ↓
Push Frontend Image
```

The workflow is located at:

```text
.github/workflows/ci.yml
```

The pipeline creates two types of tags:

```text
latest
```

and

```text
<GitHub Commit SHA>
```

Example:

```text
mannu0/devopshub-backend:latest
mannu0/devopshub-backend:<commit-sha>

mannu0/devopshub-frontend:latest
mannu0/devopshub-frontend:<commit-sha>
```

---

# 🌐 Nginx Reverse Proxy

Nginx is used as a reverse proxy inside the frontend container.

Configuration:

```text
Browser
   │
   ├── /
   │    ↓
   │   React application
   │
   └── /api/
        ↓
       Nginx
        ↓
   backend:5000
```

This removes the need for the frontend to directly expose the backend URL to the browser.

---

# 🔌 Kubernetes Services

The project uses three Kubernetes Services:

| Service  | Type      |  Port | Purpose                         |
| -------- | --------- | ----: | ------------------------------- |
| frontend | NodePort  |    80 | External access to frontend     |
| backend  | ClusterIP |  5000 | Internal backend communication  |
| mongodb  | ClusterIP | 27017 | Internal database communication |

Kubernetes DNS allows services to communicate using names such as:

```text
backend
mongodb
```

---

# 🚀 Running the Project

## Prerequisites

Install:

* Docker
* Docker Compose
* Git
* kubectl
* Minikube

---

## Start Minikube

```bash
minikube start --driver=docker
```

Check status:

```bash
minikube status
```

---

## Deploy Kubernetes Resources

Apply the namespace:

```bash
kubectl apply -f k8s/namespace.yaml
```

Apply MongoDB:

```bash
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
```

Apply backend:

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

Apply frontend:

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Check resources:

```bash
kubectl get all -n devopshub
```

Check persistent storage:

```bash
kubectl get pvc -n devopshub
```

---

## 🌐 Access the Application

Get the frontend URL:

```bash
minikube service frontend -n devopshub --url
```

Open the generated URL in your browser.

---

# 🧪 API Endpoints

### Health Check

```http
GET /api/health
```

### Get All Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

Example:

```json
{
  "title": "Learn Kubernetes",
  "description": "Practice Kubernetes deployments and services"
}
```

### Get Single Task

```http
GET /api/tasks/:id
```

### Update Task

```http
PUT /api/tasks/:id
```

### Delete Task

```http
DELETE /api/tasks/:id
```

---

# 🔍 Troubleshooting

Some of the Kubernetes communication was tested directly from inside the cluster.

Example:

```bash
kubectl run test-client -n devopshub --rm -it \
  --image=curlimages/curl -- sh
```

Then:

```bash
curl http://backend:5000/api/health
```

Expected:

```json
{
  "status": "healthy",
  "service": "backend"
}
```

This verifies Kubernetes service discovery and backend connectivity.

---

# 📊 Kubernetes Verification

Check all resources:

```bash
kubectl get all -n devopshub
```

Check Pods:

```bash
kubectl get pods -n devopshub
```

Check Services:

```bash
kubectl get svc -n devopshub
```

Check PVC:

```bash
kubectl get pvc -n devopshub
```

Check Deployment rollout:

```bash
kubectl rollout status deployment/frontend -n devopshub
```

---

# 🔐 Environment Variables

The backend uses environment variables for configuration.

Example:

```text
PORT=5000
MONGO_URI=mongodb://localhost:27017/devopshub
```

Sensitive environment files are excluded from Git using `.gitignore`.

The Kubernetes backend deployment provides the MongoDB connection using the Kubernetes service name:

```text
mongodb://mongodb:27017/devopshub
```

---

# 🎯 What This Project Demonstrates

This project was created as a practical DevOps learning project and demonstrates:

* Application containerization
* Multi-container application setup
* Docker networking
* Docker volumes
* REST API development
* Git version control
* GitHub repository management
* CI automation with GitHub Actions
* Docker image publishing
* Kubernetes Deployments
* Kubernetes Services
* Kubernetes namespaces
* Kubernetes persistent storage
* Kubernetes service discovery
* Nginx reverse proxy
* Container troubleshooting
* Kubernetes troubleshooting
* Rolling deployment and image updates

---

# 📌 Project Status

**Status: Completed**

The current version focuses on:

```text
Docker
Docker Compose
GitHub
GitHub Actions
Docker Hub
Kubernetes
Minikube
MongoDB
Persistent Storage
Nginx
Reverse Proxy
```

Additional DevOps technologies can be explored in separate projects rather than adding unnecessary complexity to this application.

---

## 👨‍💻 Author

**Manish Saini**

DevOps / Cloud Enthusiast

GitHub: `mannu-0`

---

## ⭐ If You Like This Project

Feel free to explore the repository, experiment with the deployment, and use it as a learning reference for Docker, CI/CD, and Kubernetes.

