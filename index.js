var Web3 = require('web3');
var net = require('net');
var contract = require('truffle-contract');
var path = require('path');
var MyContractJSON  = require(path.join(__dirname, '/sol/build/contracts/Storage.json'));
var identities = [];
var subscription = null;

const readline = require('readline');

//var web3 = new Web3(new Web3.providers.IpcProvider('/home/gzlm/.ethereum/testnet/geth.ipc', net));

var provider    = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

var MyContract = contract(MyContractJSON);
MyContract.setProvider(provider);

exports.bcbabies = function(){

    console.log("Hi babies!");

    //console.log(MyContract);

}