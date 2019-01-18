var express = require("express");
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require('mongoose');
var Scraped = require("./models/scraped");
var path = require('path')
var PORT = process.env.PORT || 8080;
var exphbs  = require('express-handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webdb', {useNewUrlParser: true});


app.get('/', function(req,res){
    res.render('index')
})
// create a scrape route
app.get("/scrape", function (req, res) {
    axios
        .get("https://old.reddit.com/r/webdev/")
        .then(function (response) {
            var $ = cheerio.load(response.data);
            // response.data.length = 20;
            $("p.title").each(function (i, elem) {
                if( i < 20){
                    var title = $(elem).text();
                    var link = $(elem).children().attr("href");
                    Scraped.create({
                        title: title,
                        link: link
                    }).then(function(scrapedData){
                        console.log(scrapedData);
                    });
                }
             
            });
            res.json({
                status: 200,
                message: "Scraped data from the web"
            });
        });
});

// create a route to get scraped data
app.get("/all", function (req, res) {
    Scraped
        .find()
        .then(function(data){
            res.json(data);
        });
});

app.get("/favorite", function (req, res) {
    Scraped
        .find({favorite:true})
        .then(function(data){
            res.json(data);
        });
});

app.put("/record/:id", function(req, res){
    Scraped.findByIdAndUpdate(req.params.id, {
        $set: {
            favorite: req.body.favorite
        }
    }, {
        new: true
    }).then(function(dbScraped) {
        res.json(dbScraped);
    });
});

app.get("/saved", function(req,res){
    res.render("Save");
})

app.listen(PORT, function () {
    console.log(`App is listening on http://localhost:${PORT}`);
});