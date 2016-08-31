var StorageHandler = require("./helper/StorageHandler.js");
var storage = new StorageHandler();

var ApiHandler = require("./helper/ApiHandler.js");
var api = new ApiHandler();

var getChampionById = function (id, region, participantId) {
  return new Promise (function(resolve, reject) {
    storage.getChampion(id).then(function(champName) {
      if (champName != null) {
        // Champion bekannt
        resolve({"name" : champName, "participantId" : participantId});
      } else {
        // Match von API holen
        api.getChampionByID(id, region).then(function(championData){
          // Save result into storage
          storage.addChampion (id, championData.name);
          resolve({"name" : championData.name, "participantId" : participantId});
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
  "getChampionById" : getChampionById
};
