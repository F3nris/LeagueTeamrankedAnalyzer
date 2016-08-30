var StorageHandler = require("./helper/StorageHandler.js");
var storage = new StorageHandler();

var ApiHandler = require("./helper/ApiHandler.js");
var api = new ApiHandler();

var getMatch = function (id, region) {
  return new Promise (function(resolve, reject) {
    storage.getMatch(id, region).then(function(match) {
      if (match != null) {
        // Match bekannt

      } else {
        // Match von API holen
        api.getMatchByID(id, region).then(function(matchData){
          // TODO Save Match data
          resolve(matchData);
        }).catch(function(err){
          reject(err);
        });
      }
    }).catch(function(err){
      reject(err);
    });
  });
}

module.exports = {
  "getMatch" : getMatch
};
