# Blogify
Blogify is a simple blog creating website made using NodeJS, ExpressJS, MongoDB and PassportJS.

## Table of Content
* [General Info](#general-info)
* [Technologies Used](#technologies-used)
* [Local Installation](#local-installation)

## General Info
Blogify is a platform which allows the user to create, edit or even delete the blogs which they have created. Blogs can help us to express our feelings, share our content or even learn some new stuff. The project has been deployed on Heroku.<br>
The link of the website is: <a href="https://blogify07.herokuapp.com/">`https://blogify07.herokuapp.com/`</a><br>
Click on the above link to checkout the amazing features and start creating blogs easily and efficiently.<br>

## Technologies Used
Tech Stack which has been used are as follows:<br>
* NodeJS Express Framework - This helped in defining the routes of the website and render the HTML pages.<br>
* PassportJS - This helped in user authentication and authorization and safety of user's data which was entered during registeration.<br>
* EJS - Embedded Javascript is a templating language which helped in generating HTML pages.<br>
* Cloudinary - Cloudinary provided cloud storage which helped in storing the images which were uploaded by the user while creating the blog.<br>
* Bootstrap v5.0.5 - This helped in creating the front-end and adding styles to our website.

## Local Installation
* Download the zip file of the code and extract the files.
* Open the terminal and install the dependencies by entering *npm install* into the terminal.
```shell
npm install
```
* Create a free <a href="https://cloudinary.com/">`Cloudinary account`</a>.
* Create a .env file in the root directory.
* Set up the required environment variables in the .env file: 
```javascript
DB_URL = // mongodb://localhost:27017/blogify
CLOUDINARY_API_KEY= // Cloudinary API key
CLOUDINARY_API_SECRET= // Cloudinary API secret
CLOUDINARY_CLOUD_NAME= // Cloudinary cloud name
SECRET- // "ANYTHINGCANBEHERE"
```
* Run the project by entering *npm start*.
```shell
npm start
```
* Now open the browser and search for *localhost:3000/*.<br>
