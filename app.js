//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const request = require('request');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

//create schema
const articleSchema={
title: String,
content: String
};

const Article= mongoose.model("Article", articleSchema);


//root chaining
app.route('/articles')

/////////////////////////////taregtting all articles///////////////////////////////////

//GET HTTP VERB
.get( function(req, res) {
    Article.find(function(err, articles) {
        if(!err){
            res.send(articles);
        }  else {
            res.send(err);
        }
      });
    })

//HTTP POST verb
.post(function(req, res) {
      
      //Writing to MongoDB database using Mongoose
        const newArticle= new Article ({
            title: req.body.title,
            content: req.body.content
         });

    newArticle.save(function(err){
        if(!err){
           res.send("successfully added the article");
        } else {
         res.send(err);
        }
      });
     })

     //HTTP Delete
.delete(function(req, res) {
        Article.deleteMany(function(err, articles) {
            if(!err){
                res.send('successfully delted');
            }  else {
                res.send(err);
            }
          });
        });

        

/////////////////targetting one specific article////////////////////////////

app.route('/articles/:articleTitle')

//find one article by its title
.get( function(req, res) {
            Article.findOne(

              {title: req.params.articleTitle}, //condition

              function(err, success)  //callback
              {
               if(success){
                res.send(success);
               } else{
               res.send("No such article found!");
               }
              });      
      })

//update one article
.put( function(req, res){

 Article.update(   //update from Mongoose
  {title: req.params.articleTitle},  //condition

  {title: req.body.title, content: req.body.content} , //update

  {overwrite: true},  //set overwrite to true

  function(err){  //callback
    if(!err){
      res.send("Successfully updated the article!");
    } else{
      res.send(err);
    }
    }
);   //update ends
})
.patch( function(req, res) {
  Article.update(
{ title: req.params.articleTitle },

{ $set: req.body },  

function(err){ //callback
  if(!err){
    res.send("Successfully patched the article!");
  } else{
    res.send(err);
  }
  }
);
})

.delete(function(req, res) {  //delete
  Article.deleteOne(

{title: req.params.articleTitle },  //condition

function(err){   //callback
   if(!err){
    res.send("Successfully deleted the article!");
   } else{
    res.send(err);
   }
  }
 );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});