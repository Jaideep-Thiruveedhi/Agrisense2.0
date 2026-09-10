#!/usr/bin/env bash
set -e
docker compose -f infra/docker-compose.yml up -d
echo "db + emulator up"
