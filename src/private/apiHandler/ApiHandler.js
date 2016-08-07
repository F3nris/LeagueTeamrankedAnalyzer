var rp = require('request-promise');
var apiConfig = require('../config/apiConfig');

var ApiHandler = module.exports = function (name) {
  this.analyze();
}

ApiHandler.prototype.getTeamsBySummoner = function(summonerName, region) {
  rp(apiConfig.API_BASE_URL + region + "v1.4/summoner/by-name/"+summonerName+"?api_key="+apiConfig.API_KEY)
    .then(function() {
      rp(apiConfig.API_BASE_URL + "v2.4/team/by-summoner/"+39242559+"?api_key="+apiConfig.API_KEY)
      .then(function (jsonAsString) {
          var data = JSON.parse(jsonAsString);
          console.log(data);
      })
      .catch(function (err) {
          console.log(err);
      });
    })
    .catch(function (err) {
        console.log(err);
    });
}

ApiHandler.prototype.persist = function() {

}
