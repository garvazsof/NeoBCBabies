//var Storage = artifacts.require("./Storage.sol");
var Registration = artifacts.require("./RegistrationOfBabies.sol");

module.exports = function(deployer) {
  deployer.deploy(Registration, "RegistrationOfBabies");
};