var persistAPI = require('node-persist');

var StorageHandler = module.exports = function () {
  this.teamStorage = persistAPI.create({
    dir:'../../../../private/storage/teams'
  });
  this.summStorage = persistAPI.create({
    dir:'../../../../private/storage/summoners'
  });
};

StorageHandler.prototype.lookUpTeam = function(teamName, region) {
  return this.teamStorage.getItemSync(region + "-" +teamName);
}
