## A PRACTICAL WALKTHROUGH OF USING AND DEPLOYING MICROSERVICES WITH DOCKER (on Raspberry PIs)
<a name="act1">Act 1 of 3 [The setup]</a>

### Introduction
This guide is to provide a practical walkthrough of creating, deploying, and using microservices.  The benefits of microservices when it comes to resource balancing, deployment, software development will not be discussed in this article.  However, at the end of this tutorial, you should have a high-level understanding of how containerized deployment works and a practical approach to using it as a general guide for your product deployment.

### Overview of what we are trying to build
For the purposes of this article and demonstration, we will build a hypothetical application as shown below.

A web interface will try to login via an Auth service and then after authentication will be allowed to retrieve data from a Product service.  Both the Auth and Product REST services retrieve data from a shared MongoDB database.

### Tech stack
One of the many benefits of microservices is that you can use any programming language of your choice and you can mix and match languages and database technologies.  For example, you can use a NodeJS-Express authentication service, a Java SpringBoot product service, and an Angular front end.

For my demo, I have decided to use the following tech stack.  ReactJS and .NET Core WebAPI were new for me.

 - Database - MongoDB
 - WebServices - .NET Core 6.0
 - Front-End - ReactJS
 - Deployment target - Raspberry PI
 - Docker
 - Nginx

### Setting up a new Raspberry Pi (for Pi-3 or Pi-4 only)

 1. Get the official Raspberry PI official installer from https://www.raspberrypi.com/software
 2. Use the Imager tool to install the OS onto a micro-SD card for your Pi.
 3. In the tool, you can choose your OS and in my case, I used the latest 64-bit Bullseye OS Lite version(Incidentally this is required for .NET Core 6).  You can choose the Raspberry Pi OS Lite (64-bit) installer that doesn't have desktop support if you want to run the PI completely in headless mode.
 4. Now this is an important step, before you run the imager tool, click on the advanced tab and set up the SSH and WIFI support.  This will enable you to set up your Pi in headless mode via a terminal.  This will not allow you to immediately access your PI via SSH and there is no need to use an external keyboard and monitor.
 5. You will probably need to go to your router to get the IP address of the Pi, but once you get it, you can now SSH into it with your favorite terminal like Putty, Git-Bash, etc.  Personally, I like MobaXTerm because I like to be able to run multiple sessions to different remote devices from 1 app.
 
### Installing Git [Required]
```
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install git
git --version [to check that the installation is successful]
```

### Installing Docker [Required]
	
An excellent write-up can be found [here](https://withblue.ink/2020/06/24/docker-and-docker-compose-on-raspberry-pi-os.html).
```
# Install some required packages first
sudo apt update
sudo apt install -y \
apt-transport-https \
ca-certificates \
curl \
gnupg2 \
software-properties-common

# Get the Docker signing key for packages**
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -

# Add the Docker official repos
echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list

# Install Docker
sudo apt update
sudo apt install -y --no-install-recommends \
docker-ce \
cgroupfs-mount

# Start the docker service
sudo systemctl enable --now docker

# Set local permissions if you don’t want to keep using sudo
sudo usermod -aG docker $USER

# Reboot the Pi
sudo reboot

# Test the Docker installation
docker info
```

### Installing Node [this is optional but recommended]
This is an optional step but useful for those who want to do direct development on the Pi or to do some debugging.
Install Node using NVM.  [details can be found here.  https://ostechnix.com/install-node-js-linux/]
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
# reboot the Pi
sudo reboot
nvm -v [check NVM installation]
# install node version 14 LTS but you can install a later version if you like
nvm install v14
```
 
### Installing .NET Core 6 [this is optional and for your curiosity]
This is optional but useful for those who want to do direct development on the Pi.  You can use VSCode from your laptop to remotely code using the remote development pack.  Frankly, this is mostly for laughs since it is too slow in my opinion.  You are better off doing the same thing using WSL or Docker from your computer.
Go to the [Microsoft official SDK](https://dotnet.microsoft.com/en-us/download) download site and the the installer script for Linux.
```
wget https://dotnet.microsoft.com/en-us/download/dotnet/scripts
chmod +x ./dotnet-install.sh
./dotnet-install.sh -c 6.0 InstallDir dotnetsdk [this just means to install the .NET SDK on the dotnetsdk directory.
# Test the installation.
cd dotnetsdk
./dotnet [this should run the cli
echo 'export PATH="$PATH:/home/$USER/dotnetsdk/"' >> ~/.bashrc [register the path environment so we can run the dotnet cli from anywhere]
sudo reboot
```
You should now be able to run the dotnet cli from any directory.

------
If you are able to setup your Raspberry PI with the above instructions, congratulation and I hope my instructions were easy enough to follow.  The next section will take you through my process of going from source code to Docker microservices.

## Using docker containers as microservices

<a name="act2">Act 2 of 3 [The deployment and usage]</a>

This section assumes that you have set up your Raspberry Pis according to instructions in [section 1](#act1).  In this section, I have already coded and built the all the neccessary docker containers used in this demo.  Here we will just be the consumer of these containers so that we can understand from a high level the layout of the land.  In the [next section](#act3), if you so choose, I have chronologically documented the entire soup to nuts coding process.  

```
# Install MongoDB, Auth-API and Product-API docker containers on Raspberry Pi 1.
docker pull wickedcool/hello-microservices-mongo:initial
docker pull wickedcool/hello-microservices-productapi:initial
docker pull wickedcool/hello-microservices-authapi:initial

# check that all the 3 dockers images have been downloaded.
docker images

# run the 3 images as detached microservices
docker run -d -p 27017:27017 wickedcool/hello-microservices-mongo:initial --name store-db
docker run -d -p 5500:80 wickedcool/hello-microservices-authapi:initial --name user-api 
docker run -d -p 5501:80 wickedcool/hello-microservices-productapi:initial --name product-api

# check that the 3 Docker microservices are running.
docker ps

# you can now access these services from a laptop using the port numbers 27017, 5500 and 5501.
```

```
# Install Dashboard React front-end on Raspberry Pi 2.
docker push wickedcool/hello-microservices-dashboard:initial

# check that the docker image has been downloaded.
docker images

# run the image as a detached microservice.
docker run -d -p 8080:80 wickedcool/hello-microservices-dashboard:initial --name dashboard

# check that the docker container is running.
docker ps

# we need to update the nginx configuration with your server ip.  The one I have created is for my setup.  To do this, we just need to shell into the container and change the nginx configuration.
docker exec -it [containerId] /bin/sh

# now you will now be inside the docker container.  
# navigate to the nginx.conf file to edit the IP address of your first Raspberry Pi.
vi /etc/nginx/conf.d/default.conf

# replace http://192.168.1.69 with your IP address and then save and exit vi editor.
: x!

# back in the shell command, type exit to exit from the container.
# check that the docker container is indeed will running.
docker ps

# now go to your laptop browser and navigate to 
http://raspberypi-2-ipAddress:8080 
```

## From Source Code To Docker Microservices

<a name="act3">Act 3 of 3 [From Zero to Docker Microservices]</a>

In this section, I will discuss the nitty-gritty of building the docker containers and share all the source code.  I will essentially chronologically document everything I did to get the Raspberry PI from zero to completion.  Obviously, my first step was to build the Raspberry PI image per the instructions in the first part of this write-up.  I had to use 2 Raspberry PIs because my 1GB Pi was not enough to run all my microservices smoothly so I decided to use a second Pi [an older PI 3B+(1GB)].  Essentially, I used the PI-4 to run the MongoDB and the 2 REST web services and then used the PI-3 to host my React UI front-end. 

#### Tip: All official docker images can be retrieved from http://hub.docker.com  If you are using a Windows, you would need to installed Docker Desktop.  This is required even if you are using WSL.

What I did was to write the code on my laptop and then git cloned the code on the Raspberry Pi to build the images directly there.  You can also build on your laptop but more thought needs to be go into making sure you are building the docker images for the correct target chip architecture.  For example, an AMD build will not work on the Pi's ARM chipset.  

Start by cloning the source code from https://github.com/hujanais/hello-microservices.git

1. <b>Creating a MongoDB Docker container and populating it with some test data.</b>
	- Download an official MongoDB docker image using 'docker pull mongo:4.4' on my Pi.  I used version 4.4 because it is supported by the Bullseye ARM64V8 OS.
	- Check to make sure the image has been created using 'docker images'.  The MongoDB image should show up.
	[image]
	- Now we can create and start a new MongoDB container.  
	```
	docker run -d -p 27017:27017 mongo:4.4 --name store-db
	```
	- In the event that the port 27017 is blocked and you are unable to access the database from your laptop, you might need to open up the Pi's firewall.
	```
	sudo apt install ufw
	sudo ufw allow 27017/tcp
	```
	- I use MongoDB Compass client to connect to the database from my laptop and created 2 new collections in my database called Users and Product.  The I just populated some test data inside a textfile(json format) and just imported them into the collections.
	- Incidentally, you can also interact with the database using MongoDB shell directly on the Docker container.  To do this, you will enter the Docker container in interactive mode. To enter the Docker container in interactive mode, 
	```
	docker ps # this will show you the list of running containers and the containerId
	docker exec -it [docker-container-id] bash
	# you will see that the shell prompt will change from the Pi root to the Container root.
	```
2. <b>Building the Auth-API docker container from source code. [.NET Core 6 code is in the userapi folder]</b>
	For the Auth-API, I wanted a simple way for the user to log in with a username/password and return a session token like a JWT-token.
	```
	# build a Docker image based on the Dockerfile
	docker build -t user-api .  [pay attention to the '.' in the command]
	
	# run a the Docker image that was created.
	# -d to run in detached mode, -p turns on 5500 as the public port
	docker run -d -p 5500:80 --name user-api user-api  
 	
 	# now from your laptop, you can access the AuthAPI.
 	curl --location --request POST 'http://192.168.1.XX:5500/api/users' \
		--header 'Content-Type: application/json' \
		--data-raw '{ "Username": "guest", "Password": "password" }
		# if succeeded return {isSuccess: true, jwt: 968237324 }
	```
	
3. <b>Building the Product-API docker container from source code. [.NET Core 6 code is in the productapi folder]</b>
	My requirement here is to have the ability to retrieve a list of products from the database via,
```
	# build a Docker image based on the Dockerfile
	docker build -t product-api .  [pay attention to the '.' in the command]
	
	# run a the Docker image that was created.
	# -d to run in detached mode, -p turns on 5501 as the public port
	docker run -d -p 5501:80 --name product-api product-api  
 	
 	# now from your laptop, you can access the ProductAPI.
	curl --location --request GET 'http://192.168.1.XX:5501/api/product' \
	--header 'jwt: 968237324'
	# if the token is incorrect, nothing will be returned
	# if the token is authenticated, the product list will be returned.
```
4.	 <b>The deeper dive into the .NET API Dockerfile</b>
	The instructions to build docker images are stored in a file called the Dockerfile. [yes this file has no extension]  There is also a corresponding .dockerignore file to as you guessed it, to keep unnecessary files out of the container for size considerations.
```
	# pull the official microsoft sdk docker base image for the bullseye OS.
	FROM mcr.microsoft.com/dotnet/sdk:6.0.201-bullseye-slim-arm64v8 AS build
	WORKDIR /src				# set the working folder on the container
	COPY productapi.csproj .	# copy the project file from local to /src
	RUN dotnet restore			# run the dotnet restore to update dependencies
	COPY . .					# copy everything from local to /src (minus the dockerignore list)
	RUN dotnet publish -c release -o /app	# build the application and push to /src/app folder
	
	# pull the asp.net webapi runtime
	FROM mcr.microsoft.com/dotnet/aspnet:6.0.3-bullseye-slim-arm64v8
	WORKDIR /app
	EXPOSE 80	# expose port 80
	EXPOSE 443	# export port 443 but I have SSL turned off for simplicity.
	COPY --from=build /app .
	ENTRYPOINT ["dotnet", "productapi.dll"]	# the command to run the REST service
```
To be honest, my knowledge of Docker is rudimentary, and use it only as needed at work but the heavy-duty deployment instructions are done by the CI/CD folks.  Anyhow, let's look at my Dockerfile.  This Dockerfile is pretty much identical for both the Auth and Product API.  

Just a note that there is also a docker-compose.yaml file that you can use to deploy grouped containers so that they are running on the same docker network so please look that up as well.  I am not using any of that in this tutorial to keep the readability.

5. <b>Building the React front-end from source code. [source code is in the dashboard folder]</b>
This is a bare-metal front-end so please don't judge and it was my very first time using React.  One issue I ran into is that my Raspberry Pi (1GB) was running out of memory so I decided to use a second Pi to host the React front-end.
```
docker build -t dashboard .
docker run -d -p 8080:80 --name dashboard
```
So to actually serve the front-end, we will not be using the development server.  We will use NGINX web server instead.  I suppose you can still use Apache if you like.  The Dockerfile for React Front-End (I mostly just copied this from another Angular project I was working on)

```
FROM arm64v8/node:14-bullseye-slim AS builder
# Set working directory
WORKDIR /usr/src/app

# Copy project files to working dir
COPY . .

# npm install.
RUN npm install

# build the application
RUN npm run build

# nginx state for serving content
FROM arm64v8/nginx:1.21.6-alpine# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# copy the build output to replace the default nginx contents
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 80
STOPSIGNAL SIGTERM
```

Since the front-end needs to consume the REST webservices, we need to tell nginx where to reverse-proxy the api calls to.  Note that you will need to modify this file with your server ip address to work but I will explain all that in the next section again.  Let's look at the nginx.conf file that is referenced by the dashboard Dockerfile

```
server {
	listen 80;  				# serve the webserver on port 80
	server_name localhost;
	access_log /var/log/nginx/host.access.log main;

	# this is where the you put your compiled html
	# this is the root for the webserver where the index.html will be served from
	location / {
		root /usr/share/nginx/html;
		index index.html index.htm;
	}

	# this is the reverse proxy for the user endpoint
	# note the port # 5500 which is which is what we used in the 
	# docker run -d -p 5500:80 command.
	location /api/users {
		proxy_pass http://192.168.1.69:5500;
	}

	# this is the reverse proxy for the user endpoint
	# note the port # 5501 which is which is what we used in the 
	# docker run -d -p 5501:80 command.
	location /api/product {
		proxy_pass http://192.168.1.69:5501;
	}
}
```

6. <b>Save docker images for distribution [2 options]</b>
	+ Option 1 is to save an image based on the created container
```
# save the container into a tar file that can be transmitted.
docker save [container-id] > myImage.tar

# The tar file can then be reloaded into another target device.
# the tar file will be loaded into a docker image that can be used.
docker load < myImage.tar
```

	+ Option 2 is to use docker hub which is the direction I chose.
		+ Step 1.  Create an account on hub.docker.com
		+ Step 2.  In this example, I created 4 repositories.
			- wickedcool/hello-microservices-dashboard
			- wickedcool/hello-microservices-authapi
			- wickedcool/hello-microservices-productapi
			- wickedcool/hello-microservices-mongo

```
# On the Pi, I pushed the docker images to the the repository.
	
# login to docker on the Pi.
docker login 
	
# save the docker container into an image and name it exactly as what you named in the docker hub repo.
docker commit [containerId] wickedcool/microservices-mongo:initial
	
# check to see that this new image is created.
docker images 
	
# push the image up to the repository.
docker push wickedcool/microservices-mongo:initial
	
# to use this image on the repository on another device.
docker pull wickedcool/microservices-mongo:initial.

# repeat for the other user-api, product-api and dashboard containers/images
```

Thanks for reading and I hope this gives you a high level view of how to use Docker as microservices.
