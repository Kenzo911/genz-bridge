#!/bin/bash
echo "Starting new container..."

# Ambil secrets dari AWS Systems Manager Parameter Store
OPENAI_API_KEY_SSM=$(aws ssm get-parameter --name "/genzbridge/openai_api_key" --with-decryption --query Parameter.Value --output text)
DATABASE_URL_SSM=$(aws ssm get-parameter --name "/genzbridge/database_url" --with-decryption --query Parameter.Value --output text)
DOCKER_USERNAME_SSM=$(aws ssm get-parameter --name "/genzbridge/docker_username" --query Parameter.Value --output text)
NODE_ENV_PROD="production"

if [ -z "$OPENAI_API_KEY_SSM" ] || [ -z "$DATABASE_URL_SSM" ] || [ -z "$DOCKER_USERNAME_SSM" ]; then
  echo "Error: Failed to retrieve one or more parameters from SSM Parameter Store. Ensure parameters exist and IAM role has permissions."
  exit 1
fi

# Jalanin container Docker baru dengan environment variables dari SSM
docker run -d \
  --name genz-backend \
  --restart always \
  -p 5001:5001 \
  -e DATABASE_URL="${DATABASE_URL_SSM}" \
  -e OPENAI_API_KEY="${OPENAI_API_KEY_SSM}" \
  -e PORT=5001 \
  -e NODE_ENV="${NODE_ENV_PROD}" \
  "${DOCKER_USERNAME_SSM}"/genz-bridge-backend:latest

echo "New container started."