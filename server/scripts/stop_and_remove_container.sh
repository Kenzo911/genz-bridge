#!/bin/bash
echo "Stopping and removing old container if exists..."

# Tunggu sebentar untuk memastikan Docker Daemon fully initialized
sleep 5
# Periksa apakah Docker daemon running. Jika tidak, coba start.
if ! systemctl is-active --quiet docker; then
  echo "Docker daemon is not active, attempting to start..."
  sudo systemctl start docker
  sleep 2 # Beri waktu Docker untuk start
fi

docker stop genz-backend || true
docker rm genz-backend || true
echo "Old container stopped and removed."