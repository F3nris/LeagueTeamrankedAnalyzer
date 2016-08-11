var rp = require('request-promise');
var urlencode = require('urlencode');

var apiConfig = require('../config/apiConfig');

var ApiHandler = module.exports = function (name) {
  //this.analyze();
}

ApiHandler.prototype.getTeamsBySummoner = function(summonerName, region) {
  summonerName = summonerName.toLowerCase();
  region = region.toLowerCase();

  var self = this;
  var summonerPromise = self.getSummoner(summonerName, region);

  summonerPromise.then(function(jsonAsString){
    var summonerData = JSON.parse(jsonAsString);
    console.log(summonerData);
    console.log(summonerName.toLowerCase());
    rp(apiConfig.API_BASE_URL + region + "/v2.4/team/by-summoner/"+summonerData[summonerName].id+"?api_key="+apiConfig.API_KEY)
    .then(function (jsonAsString) {
        var data = JSON.parse(jsonAsString);
        console.log(data);
    })
    .catch(function (err) {
        console.log(err);
    });
  }).catch(self.errorFunction);
}

ApiHandler.prototype.getSummoner = function(summonerName, region) {
  summonerName = summonerName.toLowerCase();
  region = region.toLowerCase();
  var htmlName = urlencode(summonerName);

  return rp(apiConfig.API_BASE_URL + region + "/v1.4/summoner/by-name/"+htmlName+"?api_key="+apiConfig.API_KEY);
}

ApiHandler.prototype.errorFunction = function(err) {
  console.log("An error occured:")
  console.log(err);
}
