//basic framework setup
var express = require('express');
var app = express();

var methodOverride = require('method-override');
app.use(methodOverride('_method'));

//views setup
app.set('view engine', 'ejs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//database setup
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/countries");

//schema setup
var countrySchema = new mongoose.Schema({
  name: String,
  flag: String,
  capital: String,
  population: Number
});

var Country = mongoose.model("Country", countrySchema);

//routes
app.get('/countries', function(req, res) {
  Country.find({}, function(err, data) {
    res.render('index', {country: data} )
  });
});

app.get('/countries/new', function(req, res){
  res.render('new');
});

app.post('/countries', function(req, res) {
  Country.create(req.body, function(err, data) {
    if(err) {
      res.render('404')
    } else {
      res.redirect('/countries')
    }
  });
});

app.put('/countries/:id', function(req, res) {
  Country.findByIdAndUpdate(req.params.id, req.body, function(err, data) {
    res.redirect('/countries');
  })
})
app.get('/countries/:id', function(req, res) {
  Country.findById(req.params.id, function(err, data) {
    if (err) {
      res.render('404')
    } else {
      res.render('details', {country: data});
    }
  });
});

app.get('/countries/:id/edit', function(req, res) {
  Country.findById(req.params.id, function(err, data) {
    res.render('edit', {country: data});
  });
});

app.delete('/countries/:id', function(req, res) {
  Country.findByIdAndRemove(req.params.id, function(err, data){
  res.redirect('/countries');
  });
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
