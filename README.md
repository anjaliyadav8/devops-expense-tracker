# 💰 Expense Tracker - Complete DevOps Project
### By Anjali

---

## 📱 What is this App?
A personal finance tracker to manage income and expenses with beautiful UI.

**Features:**
- Add Income and Expenses
- Category wise tracking (Food, Transport, Shopping etc.)
- Real-time Balance calculation
- Search and Filter transactions
- Spending chart by category

---

## 🏗️ Project Structure
```
devops-expense/
├── frontend/
│   ├── index.html          → Complete UI
│   └── Dockerfile          → Frontend container
├── backend/
│   ├── server.js           → REST API
│   ├── package.json
│   └── Dockerfile          → Backend container
├── k8s/
│   ├── namespace.yaml      → K8s namespace
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   └── hpa.yaml            → Auto scaling
├── terraform/
│   ├── main.tf             → AWS infrastructure
│   └── variables.tf
├── ansible/
│   ├── playbook.yml        → Server setup
│   └── inventory.ini
├── monitoring/
│   └── prometheus.yml      → Metrics collection
├── jenkins/
│   └── Jenkinsfile         → Jenkins pipeline
├── .github/workflows/
│   └── ci-cd.yml           → GitHub Actions
└── docker-compose.yml      → Multi container setup
```

---

## 🚀 HOW TO RUN

### Method 1 - Simple (Open directly)
Open `frontend/index.html` in browser

### Method 2 - With Docker
```bash
docker compose up --build
```
Open: http://localhost:80

### Method 3 - Kubernetes
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
kubectl get pods -n expense-tracker
kubectl get services -n expense-tracker
```

### Method 4 - Terraform (AWS)
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Method 5 - Ansible
```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

---

## 🔄 CI/CD Pipeline
```
Developer pushes code to GitHub
           ↓
GitHub Actions triggered automatically
           ↓
Job 1: TEST - Run API health check
           ↓
Job 2: BUILD - Build Docker images
           ↓
Job 3: DEPLOY - Deploy to production
           ↓
App is LIVE! ✅
```

---

## 🐳 Docker Commands
```bash
# Build images
docker build -t expense-frontend ./frontend
docker build -t expense-backend ./backend

# Run with compose
docker compose up --build

# See running containers
docker ps

# Stop containers
docker compose down

# See logs
docker compose logs
```

---

## ☸️ Kubernetes Commands
```bash
# Apply all files
kubectl apply -f k8s/

# See pods
kubectl get pods -n expense-tracker

# See services
kubectl get services -n expense-tracker

# See deployments
kubectl get deployments -n expense-tracker

# Scale up
kubectl scale deployment backend --replicas=5 -n expense-tracker
```

---

## 📊 DevOps Tools Used
| Tool | Purpose |
|------|---------|
| Docker | Containerize application |
| Docker Compose | Run multi-container app |
| Kubernetes | Orchestrate containers |
| GitHub Actions | CI/CD automation |
| Terraform | AWS infrastructure |
| Ansible | Server configuration |
| Prometheus | Monitoring metrics |
| Jenkins | Alternative CI/CD |
