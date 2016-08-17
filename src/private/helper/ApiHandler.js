var rp = require('request-promise');
var urlencode = require('urlencode');

var apiConfig = require('../config/apiConfig');

var ApiHandler = module.exports = function (name) {
  //this.analyze();
}

ApiHandler.prototype.getTeamsBySummonerID = function(summonerID, region) {
  var self = this;
  region = region.toLowerCase();

  return new Promise(function (resolve, reject) {
    rp(apiConfig.API_BASE_URL + region + "/v2.4/team/by-summoner/"+summonerID+"?api_key="+apiConfig.API_KEY)
    .then(function (jsonAsString) {
      var dataArray = JSON.parse(jsonAsString)[summonerID];
      var result = dataArray.map(function(el) {
        return {
          "id": el.fullId,
          "name": el.name
        };
      });
      resolve(result);
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

ApiHandler.prototype.getSummoner = function(summonerName, region) {
  summonerName = summonerName.toLowerCase();
  region = region.toLowerCase();
  var htmlName = urlencode(summonerName);

  return new Promise(function(resolve, reject) {
    rp(apiConfig.API_BASE_URL + region + "/v1.4/summoner/by-name/"+htmlName+"?api_key="+apiConfig.API_KEY)
    .then(function(dataAsString){
      var summonerData = JSON.parse(dataAsString)[summonerName];
      resolve ({
        "id": summonerData.id,
        "name": summonerData.name
      });
    }).catch(function(err){
      self.errorFunction(err);
      reject();
    });
  });
}

ApiHandler.prototype.errorFunction = function(err) {
  console.log("An error occured:")
  console.log(err);
}
