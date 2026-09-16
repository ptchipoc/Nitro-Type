COMPOSE_FILE=docker-compose.yml

all: build up

build: nginx-certs
	docker compose -f $(COMPOSE_FILE) build

up:
	docker compose -f $(COMPOSE_FILE) up -d

clean:
	docker compose -f $(COMPOSE_FILE) down

mata:
	docker compose -f $(COMPOSE_FILE) down -v

fclean:
	docker compose -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans
	docker image prune -af

nginx-certs:
	@bash ./nginx/tools/generate-certs.sh

logs:
	docker compose -f $(COMPOSE_FILE) logs -f backend

logs-backend:
	docker compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend:
	docker compose -f $(COMPOSE_FILE) logs -f frontend

logs-postgres:
	docker compose -f $(COMPOSE_FILE) logs -f postgres

logs-redis:
	docker compose -f $(COMPOSE_FILE) logs -f redis

logs-nginx:
	docker compose -f $(COMPOSE_FILE) logs -f nginx

db:
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma studio

re: mata build up
