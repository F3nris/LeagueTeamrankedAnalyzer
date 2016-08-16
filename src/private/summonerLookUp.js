var StorageHandler = require("./helper/StorageHandler.js");
var storage = new StorageHandler();

var ApiHandler = require("./helper/ApiHandler.js");
var api = new ApiHandler();

var getSummonerID = function (name, region) {
  return new Promise(function(resolve, reject) {

    // Check if summoner is already stored
    var storedSummPromise = storage.getSummonerPromise(name, region);
    storedSummPromise.then(function(storedSumm){
      if (storedSumm != null) {
        console.log("FROM STORAGE")
        resolve(storedSumm.id);
      } else {
        // Look up summoner in API
        api.getSummoner(name, region).then(function(summData){
          console.log("FROM API");
          storage.addSummoner(name, region, summData);
          resolve(summData.id);
        }).catch(function(err){
          reject(err);
        });
      }
    }).catch(function(err){
      reject(err);
    });
  });
};

module.exports = {
  "getSummonerID" : getSummonerID
};
