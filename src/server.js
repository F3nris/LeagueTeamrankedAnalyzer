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
    } else if (req.params.formName == "teamsBySummoner") {
      req.url = '/teamsBySummoner/' + req.query.region + "/" + req.query.summName ;
    } else {
      req.url = "404";
    }
    next();
  });

  app.get('/team/:region/:teamName', function(req,res, next){
    var region = req.params.region;
    var teamName = req.params.teamName;

    var result = teamLookUp.getTeam(teamName, region).then(function(data){
      if (data != null){
        res.render('team', { "teamStats" : data });
      } else {
        res.render('team-unknown', { "region": region, "teamName": teamName});
      }
    }).catch(function(err){
      res.url = "/500";
      next();
    });
  });

  app.get('/teamsBySummoner/:region/:name', function(req, res, next) {
    var region = req.params.region;
    var summoner = req.params.name;

    var result = teamLookUp.getTeamsBySummoner(summoner, region).then(function(data){
      if (data != null) {
        res.render('team-select', {
          "summoner" : summoner,
          "region" : region,
          "teamList": result.teams
        });
      } else {
          res.render('summoner-unknown', { "region": region, "summoner": summoner});
      }
    }).catch (function(err){
      console.log(err);
      res.render('500');
    });
  });

  app.get('/500', function(req, res){
    res.render('500');
  });

  app.use(function(req, res, next) {
    res.status(404).render('404');
  });

  app.listen(config.PORT, function () {
    console.log('Example app listening on port '+config.PORT+'!');
  });
};
