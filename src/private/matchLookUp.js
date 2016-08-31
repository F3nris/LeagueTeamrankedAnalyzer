var StorageHandler = require("./helper/StorageHandler.js");
var storage = new StorageHandler();

var ApiHandler = require("./helper/ApiHandler.js");
var api = new ApiHandler();

var staticLookUp = require("./staticLookUp");

var statKeys = [
  // Base stats
  "kills", "deaths", "assists", "minionsKilled", "neutralMinionsKilled",
  // Dmg Stats
  "totalDamageDealtToChampions", "totalDamageTaken",
  // Utility Stats
  "visionWardsBoughtInGame", "wardsPlaced", "totalTimeCrowdControlDealt"
];

var getMatch = function (id, region) {
  return new Promise (function(resolve, reject) {
    storage.getMatch(id, region).then(function(match) {
      if (match != null) {
        // Match bekannt
        resolve(match);
      } else {
        // Match von API holen
        api.getMatchByID(id, region).then(function(matchData){
          var result = {
            date : matchData.matchCreation,
            duration : matchData.matchDuration,
            season : matchData.season,
            teams : matchData.teams
          }

          var participants = [];

          for (var participantIdentity of matchData.participantIdentities) {
            var playerData = participantIdentity.player;
            participants.push({
              "id"   : playerData.summonerId,
              "name" : playerData.summonerName
            });
          }

          // NOTE at this point every particpants data is formatted the same way looked up summoners are stored
          // So they could be added to the storage here (maybe for later if summoners get their own page)

          var championPromises = [];

          for (var i=0; i<matchData.participants.length; i++) {
            var participant = participants[i];
            var participantReq   = matchData.participants[i];

            participant.teamId   = participantReq.teamId;
            championPromises.push(staticLookUp.getChampionById(participantReq.championId, region, i));

            participant.lane     = participantReq.timeline.lane;
            participant.role     = participantReq.timeline.role;

            for (var j=0; j<statKeys.length; j++) {
              var key = statKeys[j];
              participant[key] = participantReq.stats[key];
            }

            // Time-line Stats
            // TODO
          }

          Promise.all(championPromises).then(function(champData){
            for (var champDate of champData) {
              participants[champDate.participantId].champion = champDate.name;
            }
            result.participants = participants;

            // Save result into storage
            storage.addMatch (id, region, result);
            resolve(result);
          }).catch(function(err){
            reject(err);
          });
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
