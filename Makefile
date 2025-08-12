.PHONY: help install dev build clean test docker-up docker-down db-migrate db-reset railway-deploy

# Default target
help:
	@echo "PlantDex Development Commands"
	@echo "============================="
	@echo "install     - Install all dependencies"
	@echo "dev         - Start development servers (frontend + backend)"
	@echo "dev:front   - Start frontend only"
	@echo "dev:back    - Start backend only"
	@echo "build       - Build frontend for production"
	@echo "clean       - Clean all build artifacts and node_modules"
	@echo "test        - Run tests"
	@echo "docker-up   - Start all services with Docker Compose"
	@echo "docker-down - Stop all Docker services"
	@echo "db:reset    - Reset database and run migrations"
	@echo "db:migrate  - Migrate data from SQLite to PostgreSQL"
	@echo "format      - Format code with prettier and black"
	@echo "lint        - Run linting checks"
	@echo "railway:deploy - Deploy to Railway"

# Install dependencies
install:
	@echo "Installing root dependencies..."
	npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt

# Development
dev:
	@echo "Starting development servers..."
	npm run dev

dev:front:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

dev:back:
	@echo "Starting backend development server..."
	cd backend && python -m uvicorn main:app --reload

# Build
build:
	@echo "Building frontend..."
	cd frontend && npm run build

# Clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/.next
	rm -rf frontend/out
	rm -rf frontend/dist
	rm -rf backend/__pycache__
	rm -rf backend/app/__pycache__
	rm -rf backend/app/*/__pycache__
	@echo "Cleaning node_modules..."
	rm -rf node_modules
	rm -rf frontend/node_modules

# Test
test:
	@echo "Running tests..."
	cd frontend && npm run test

# Docker
docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

# Database
db:reset:
	@echo "Resetting database..."
	cd backend && python create_tables.py

db:migrate:
	@echo "Migrating data to PostgreSQL..."
	cd backend && python migrate_to_postgres.py

# Railway Deployment
railway:deploy:
	@echo "Deploying to Railway..."
	@if command -v railway >/dev/null 2>&1; then \
		railway up; \
	else \
		echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"; \
		exit 1; \
	fi

railway:login:
	@echo "Logging into Railway..."
	@if command -v railway >/dev/null 2>&1; then \
		railway login; \
	else \
		echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"; \
		exit 1; \
	fi

# Code formatting
format:
	@echo "Formatting frontend code..."
	cd frontend && npm run format
	@echo "Formatting backend code..."
	cd backend && black .

# Linting
lint:
	@echo "Running frontend linting..."
	cd frontend && npm run lint
	@echo "Running backend linting..."
	cd backend && flake8 .

# Quick setup for new developers
setup: install
	@echo "Setting up development environment..."
	@echo "1. Copy backend/env.example to backend/.env and configure"
	@echo "2. Run 'make db:reset' to setup database"
	@echo "3. Run 'make dev' to start development servers"
	@echo "Setup complete! 🎉"

# Production setup
setup:production:
	@echo "Setting up production environment..."
	@echo "1. Copy backend/env.production.example to backend/.env"
	@echo "2. Set DATABASE_URL to your PostgreSQL connection string"
	@echo "3. Set SECRET_KEY to a secure random string"
	@echo "4. Run 'make railway:deploy' to deploy to Railway"
	@echo "Production setup complete! 🚀" 