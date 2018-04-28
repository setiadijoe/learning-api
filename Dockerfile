FROM node:8.9.0-alpine

RUN apk update && apk add bash && apk add curl && apk add git

# create app directory
WORKDIR /app

# copy all package file
COPY package*.json ./

# install package
RUN npm install

# install process manager (pm2)
RUN npm install pm2 -g

# copy your app to work directory
COPY . /app

# Expose port
EXPOSE 3030

# migrate db and run app
CMD npm run migrate && \
  npm run prod
