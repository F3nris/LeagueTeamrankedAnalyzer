module.exports = function(app) {
  var express = require('express');

  var config = require("./private/config/serverConfig.js");
  var apiHandler = require("./private/apiHandler/ApiHandler.js");

  var StorageHandler = require("./private/storageHandler/Storage.js");
  var storage = new StorageHandler();


  app.use('/public', express.static('./public'));

  app.set("view engine", "pug");

  app.get("/home", function(req, res){
    res.render('home');
  });

  app.get('/formHandler/:formName', function(req, res, next){
    if (req.params.formName == "team") {
      req.url = '/team/' + req.query.region + "/" + req.query.teamName ;
    } else if (req.params.formName == "summoner") {
      req.url = '/teamBySummoner/' + req.query.region + "/" + req.query.summonerName ;
    } else {
      req.url = "404";
    }
    next();
  });

  app.get('/team/:region/:teamName', function(req,res){
    var region = req.params.region;
    var teamName = req.params.teamName;

    var result = storage.lookUpTeam(teamName, region);
    //result = {}; result.name = "Equivalent Exchange";

    if (!result) {
      res.render('team-unknown', { "region": region, "teamName": teamName});
    } else {
      res.render('team', { "teamStats" : result });
    }
  });

  app.get('/teamBySummoner/:region/:name', function(req, res, next) {

  });

  app.use(function(req, res, next) {
    res.status(404).render('404');
  });

  app.listen(config.PORT, function () {
    console.log('Example app listening on port '+config.PORT+'!');
  });
};
