SHELL := /bin/bash

.PHONY: build up down logs ps prune

build:
\tdocker compose build --no-cache

up:
\tdocker compose up -d

down:
\tdocker compose down

logs:
\tdocker compose logs -f --tail=200

ps:
\tdocker compose ps

prune:
\tdocker system prune -af --volumes
