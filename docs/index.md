## A PRACTICAL WALKTHROUGH OF USING AND DEPLOYING MICROSERVICES
Act 1 of 3 [The setup]

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
