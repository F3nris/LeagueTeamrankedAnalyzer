var StorageHandler = require("./helper/StorageHandler.js");
var storage = new StorageHandler();

var ApiHandler = require("./helper/ApiHandler.js");
var api = new ApiHandler();

var summonerLookUp = require("./summonerLookUp.js");

var getTeamsBySummoner = function (name, region) {
  return new Promise(function(resolve, reject) {

    // Get Summoner (id)
    var sIdPromise = summonerLookUp.getSummonerID(name, region);
    sIdPromise.then(function(id){
      api.getTeamsBySummonerID(id, region).then(function(teamList){
        for (team of teamList){
          storage.addTeam(team.name, region, team);
        }
        resolve(teamList);
      }).catch(function(err){
        reject(err);
      });
    }).catch(function(err){
      reject(err);
    });
  });
};

var getTeam = function (name, region) {
  return new Promise (function(resolve, reject) {
    storage.getTeam(name, region).then(function(team) {
      if (team != null) {
        // TODO Check when team was last updated
        api.getTeamByID(team.id, region).then(function(teamData){
          resolve(teamData);
        }).catch(function(err){
          reject(err);
        });

      } else {
        // Team noch unbekannt
        reject(undefined);
      }
    }).catch(function(err){
      reject(err);
    });
  });
}

module.exports = {
  "getTeamsBySummoner" : getTeamsBySummoner,
  "getTeam" : getTeam
};
