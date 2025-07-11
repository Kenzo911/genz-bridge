#!/bin/bash
set -e # Exit jika ada command yang gagal

DEPLOYMENT_BUNDLE_DIR="/opt/codedeploy-agent/deployment-root/${DEPLOYMENT_GROUP_ID}/${DEPLOYMENT_ID}/deployment-archive"

# Ambil secrets dari AWS Systems Manager Parameter Store
OPENAI_API_KEY_SSM=$(aws ssm get-parameter --name "/genzbridge/openai_api_key" --with-decryption --query Parameter.Value --output text)
DATABASE_URL_SSM=$(aws ssm get-parameter --name "/genzbridge/database_url" --with-decryption --query Parameter.Value --output text)
REGISTRY=$(aws ssm get-parameter --name "/genzbridge/docker_registry" --query Parameter.Value --output text)

NODE_ENV_PROD="production"

if [ -z "$OPENAI_API_KEY_SSM" ] || [ -z "$DATABASE_URL_SSM" ] || [ -z "$REGISTRY" ]; then
  echo "Error: Failed to retrieve one or more parameters from SSM Parameter Store."
  exit 1
fi

IMAGE_TAG="latest" 

echo "Starting aggressive Docker container management..."

# Stop semua container yang sedang berjalan
echo "Stopping all running containers..."
docker stop $(docker ps -q) || true

# Hapus semua container yang ada
echo "Removing all containers..."
docker rm $(docker ps -aq) || true

# Hapus semua image yang tidak terpakai (dangling images)
echo "Pruning unused Docker images..."
docker image prune -f || true 


echo "Logging into ECR..."
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin "${REGISTRY}" || true


echo "Performing forced pull of latest image: ${REGISTRY}/genz-bridge-backend:${IMAGE_TAG}"
docker pull "${REGISTRY}/genz-bridge-backend:${IMAGE_TAG}"

if [ $? -ne 0 ]; then
  echo "Error: Failed to pull Docker image. Check ECR registry, tag, and permissions."
  exit 1
fi

echo "Verifying image pulled..."
# Opsional: Verifikasi content image yang ditarik
docker run --rm "${REGISTRY}/genz-bridge-backend:${IMAGE_TAG}" cat /app/dist/server.js | grep "trust proxy" || true
 docker run --rm "${REGISTRY}/genz-bridge-backend:${IMAGE_TAG}" cat /app/dist/server.js | grep "CORS: Allowing origin" || true

echo "Starting new container: ${REGISTRY}/genz-bridge-backend:${IMAGE_TAG}"
# Jalankan container Docker baru
docker run -d \
  --name genz-backend \
  --restart always \
  -p 5001:5001 \
  -e DATABASE_URL="${DATABASE_URL_SSM}" \
  -e OPENAI_API_KEY="${OPENAI_API_KEY_SSM}" \
  -e PORT=5001 \
  -e NODE_ENV="${NODE_ENV_PROD}" \
  "${REGISTRY}/genz-bridge-backend:${IMAGE_TAG}"

if [ $? -ne 0 ]; then
  echo "Error: Failed to start Docker container after pull."
  exit 1
fi

echo "New container started."
echo "Deployment complete."
