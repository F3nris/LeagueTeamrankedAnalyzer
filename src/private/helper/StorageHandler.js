var redis = require('redis');
var bluebird = require('bluebird');
var hash = require('string-hash');

// Activate Promises for redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var StorageHandler = module.exports = function () {
  this.storage = redis.createClient();
};

StorageHandler.prototype.getTeamPromise = function(teamName, region) {
  var self = this;
  var saveName = hash(region + "-" + teamName);
  return new Promise(function(resolve, reject){
    self.storage.getAsync("team:"+saveName).then(function(data){
      resolve(JSON.parse(data));
    }).catch(function(err){
      reject(err);
    });
  });
}

StorageHandler.prototype.getSummonerPromise = function(summName, region) {
  var self = this;
  var saveName = hash(region + "-" + summName);
  return new Promise(function(resolve, reject){
    self.storage.getAsync("summ:"+saveName).then(function(data){
      resolve(JSON.parse(data));
    }).catch(function(err){
      reject(err);
    });
  });
}

StorageHandler.prototype.addSummoner = function(summName, region, data) {
  var saveName = hash(region + "-" + summName);
  this.storage.set("summ:"+saveName, JSON.stringify(data));
}

StorageHandler.prototype.addTeam = function(teamName, region, data) {
  var saveName = hash(region + "-" + teamName);
  this.storage.set("team:"+saveName, JSON.stringify(data));
}
