FROM node:lts-slim

RUN apt-get update && apt-get upgrade -y

# Create app directory
WORKDIR /usr/local/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 5555
CMD ["npm", "run", "dev"]