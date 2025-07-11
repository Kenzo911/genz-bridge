echo "Stopping and removing old container if exists..."
docker stop genz-backend || true
docker rm genz-backend || true
echo "Old container stopped and removed."