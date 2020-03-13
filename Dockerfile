FROM node:10
RUN apt-get update
# Set the home directory to /root
ENV HOME /root
# cd into the home directory
WORKDIR /root
# Install Node
RUN apt-get update; \
    apt-get install -y curl gnupg; \
    curl -sL https://deb.nodesource.com/setup_8.x | bash -; \
    apt-get install -y nodejs; \
    rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y npm

RUN apt-get install -y nodejs
RUN apt-get install -y npm
# Copy all app files into the image
COPY . .
# Download dependancies
RUN npm install
# Allow port 5000 to be accessed
# from outside the container
EXPOSE 8000
# Run the app
CMD ["node", "server.js"]
# CMD ["npm start", "/frontend"]