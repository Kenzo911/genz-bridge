#!/bin/bash
echo "Pulling latest Docker image..."

# AMbil DOCKER_USERNAME dari AWS Systems Manager Parameter Store
DOCKER_USERNAME_SSM=$(aws ssm get-parameter --name "/genzbridge/docker_username" --query Parameter.Value --output text)
if [ -z "$DOCKER_USERNAME_SSM" ]; then
  echo "Error: Failed to retrieve DOCKER_USERNAME from SSM Parameter Store."
  exit 1
fi

docker pull "${DOCKER_USERNAME_SSM}"/genz-bridge-backend:latest || true
echo "Docker image pulled."