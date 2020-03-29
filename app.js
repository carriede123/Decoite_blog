//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");

const homeStartingContent = "This is my blog. This is my safe place to share thought, experiences, and feelings.";

const aboutContent = "This blog is for my ICS385 course.";

const contactContent = "Email me @ carried3@hawaii.edu";

const weatherbyCityContent = "The Weather in Kahului is Sunny";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
 res.render("home", {
     startingContent: homeStartingContent,
     posts: posts
                    });
 
});

 app.get("/about", function(req, res){
 res.render("about", {aboutContent: aboutContent});  
});

 app.get("/contact", function(req, res){
 res.render("contact", {contactContent: contactContent});   
});

app.get("/weatherbycity", function(req, res){
 res.render("weatherbycity", {weatherbyCityContent});  
    
});

 app.get("/compose", function(req, res){
  res.render("compose");   
});

 app.post("/compose", function(req, res){
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };
     
     posts.push(post);
     
     res.redirect("/");
     
     
});

app.get("/posts/:postName",function(req,res){
    const requestedTitle = _.lowerCase(req.params.postName);

    posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);
        
        if (storedTitle === requestedTitle) {
        res.render("post", {
            title: post.title,
            content: post.content
        });    
        }
        
    }); 


});

 const weatherCity = ["cityInput"];

  app.get("/weather", function(req, res){
  res.render("weather", {weatherCity: weatherCity});   
});

let city = ["cityInput"];

  app.post("/weather", function(req, res){
      var cityname = String(req.body.cityInput);
        
   const units = "imperial";
   const apiKey = "67f6b382921c1e89b39b20d4f9556f22";
   const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=" + units + "&APPID=" + apiKey;
        
   https.get(url, function(response){
       response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const humidity = weatherData.main.humidity;
           const weatherDescription = weatherData.weather[0].description;
        
      res.write("<h1> The current weather in " + city + " is " + weatherDescription + "<h1>");
        
     res.write("<h2>The temperatire is " + temp + "Degrees Fahrenheit and the humidity is " + humidity + "% <h2>");
    });
     
      res.send();
     
     
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
