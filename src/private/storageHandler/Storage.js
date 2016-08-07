var persistAPI = require('node-persist');

var Storage = module.exports = function () {
  this.teamStorage = persistAPI.create({
    dir:'../../../../private/storageHandler/storage/teams'
  });
  this.summStorage = persistAPI.create({
    dir:'../../../../private/storageHandler/storage/summoners'
  });
};

Storage.prototype.lookUpTeam = function(teamName, region) {
  return this.teamStorage.getItemSync(region + "-" +teamName);
}
