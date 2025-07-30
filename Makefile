start:
	cp environments/development .env
	docker compose up -d

stop:
	docker compose down

logs:
	docker compose logs -f frontend

prod-tag:
	git tag -d release_$(release) || true
	git tag release_$(release)
	git push origin release_$(release)