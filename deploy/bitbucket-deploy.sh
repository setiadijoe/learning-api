#! /bin/bash

# INSTRUCTIONS
# ==================================================
# 1. Setup bitbucket pipeline Environment Variables
#   - APP_NAME=faspay-service
#   - GCLOUD_CLUSTER=taralite-integration
#   - GCLOUD_APIKEY=<base64 your_apikey_file.json>
#   - PRODUCTION_ENV=<base64 your_env_file>
# ==================================================

# Download google sdk
echo 'Downloading google sdk...'
curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-199.0.0-linux-x86_64.tar.gz
tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/
/tmp/google-cloud-sdk/install.sh -q
source /tmp/google-cloud-sdk/path.bash.inc
gcloud -v

# Install Kubectl
gcloud components install kubectl -q

# Authentication to goole cloud
echo 'Authenticating to google cloud...'
echo $GCLOUD_APIKEY | base64 --decode --ignore-garbage > ./gcloud-api-key.json
gcloud auth activate-service-account --key-file gcloud-api-key.json

# Set project ID
PROJECT_ID=$(gcloud config get-value project)
gcloud config set project $PROJECT_ID

# Authenticating kubectl to cluster
gcloud container clusters get-credentials $GCLOUD_CLUSTER --zone=asia-southeast1-a

# Setup App docker image
echo 'Creating docker image...'
IMAGE=gcr.io/$PROJECT_ID/$APP_NAME:$BITBUCKET_TAG

echo "$PRODUCTION_ENV" | base64 --decode > .env # write production_env base64 decoded to .env file

docker build -t $IMAGE ../Dockerfile   # build docker image

echo 'Uploading docker image....'
gcloud docker -- push $IMAGE # push image to google container registry

kubectl set image deployment/$APP_NAME $APP_NAME=$IMAGE
echo 'Finish, please wait a moment to take effect to your service'
