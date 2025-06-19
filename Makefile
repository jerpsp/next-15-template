start:
	cp environments/development .env
	docker compose up -d

stop:
	docker compose down

logs:
	docker compose logs -f frontend