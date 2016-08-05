module.exports = function(app) {
  var config = require("./private/config/serverConfig.js");

  app.set("TeamAnalyzer", new TeamAnalyzer());

  app.listen(config.PORT, function () {
    console.log('Example app listening on port '+config.PORT+'!');
  });
};
