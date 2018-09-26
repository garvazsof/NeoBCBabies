'use strict'
var express = require("express");
var router = express.Router();

var ethers = require('ethers');
var provider = ethers.providers.getDefaultProvider('ropsten');
var etherscanProvider = new ethers.providers.EtherscanProvider("ropsten");

//Ropsten Addres Contract (DLT Babies)
var contractAddress  = '0x141a34c1f5751c878226a51645d34785797a6385';
var abi =  [{"constant":true,"inputs":[],"name":"getCommunityName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_communityName","type":"string"}],"name":"setCommunityName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_babyHashFingerprint","type":"bytes32"}],"name":"getBabyByHashFingerprint","outputs":[{"name":"_registeredName","type":"string"},{"name":"_genero","type":"uint256"},{"name":"_birthDay","type":"uint256"},{"name":"_timeStamp","type":"uint256"},{"name":"_data","type":"string"},{"name":"_hospitalAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_registeredName","type":"string"},{"name":"_babyHashFingerprint","type":"bytes32"},{"name":"_genero","type":"uint256"},{"name":"_birthDay","type":"uint256"},{"name":"_data","type":"string"},{"name":"_hospitalAddress","type":"address"}],"name":"registerBaby","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_communityName","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"registeredName","type":"string"},{"indexed":false,"name":"timeStamp","type":"uint256"}],"name":"resultRegister","type":"event"}];
    
// TODO:  Cuenta de pruebas
// var addressAccount = '0x8e7eb9b1960abfed2e525932a03a15e3f72b8a02';
var privateKey = '0x1AF0B7DD30D55DE69303C2DDCF7ABD654EA46AD44B50163307EF425CD8C316C5';

//wallet para transacciones
var wallet = new ethers.Wallet(privateKey,provider);
var contract_sign = new ethers.Contract(contractAddress, abi, wallet);
var contract = new ethers.Contract(contractAddress, abi, provider);

//Todas las transacciones, filtrados por address account
router.get("/babies/transactions/:addressAccount", function(req, res) {
    var babies = [];
    var addressAccount = req.params.addressAccount;

    etherscanProvider.getHistory(contractAddress).then(function(history) {
        if(history.length > 0)
        {
            for(var i=0; i < history.length; i++){
                if(history[i].from.toUpperCase() == addressAccount.toUpperCase()){
                    babies.push({
                        result: "OK",
                        tx_hash: history[i].hash
                    });
                }            
            }
        }
        res.status(200).send(babies); 
    });
});

//Detalle de transaccion, filtrado por tx_hash
router.get("/babies/transactions/detail/:tx_hash", function(req, res) {
    var babies = [];
    var tx_hash = req.params.tx_hash;
    provider.getTransaction(tx_hash).then(function(transaction) {
        babies.push({
            result: "OK",
            transaction: transaction
        });
        res.status(200).send(babies); 
    });
});


//Devuelve el nombre de la institucion
router.get("/babies/getCommunityName/", function(req, res) {
    var babies = [];
    var callPromise = contract.getCommunityName();

    callPromise.then(function(result){
        babies.push({
            result: "OK",
            value: result
        });
        res.status(200).send(babies); 
    });
});
    

router.post("/babies/setCommunityName/", function(req, res) {
    var babies = [];
    var communityName = req.body.communityName;
    var sendPromise = contract_sign.setCommunityName(communityName);

    sendPromise.then(function(transaction){
        // console.log(transaction);
        babies.push({
            result: "OK",
            tx_hash: transaction.hash
        });
        res.status(200).send(babies); 
    });       
});

//Inserta un nuevo registro de Bebes
router.post("/babies/", function(req, res) {
    var babies = [];
    try
    {
        var strBabyHashFingerprint = req.body.babyHashFingerprint;
        var strRegisteredName = req.body.registeredName;
        var uintGenero = req.body.genero;
        var uintBirthDay = req.body.birthDay;
        var addrHospitalAddress = req.body.hospitalAddress;

        //TODO: Send to IPFS Server
        // var strImgMotherFront = req.body.imgMotherFront;
        // var strImgFatherFront = req.body.imgFatherFront;
        // var strImgMotherBack = req.body.imgMotherBack;
        // var strFatherBack = req.body.imgFatherBack;

        var aData = [{
            motherHashFingerprint: req.body.motherHashFingerprint,
            motherName: req.body.motherName,
            fatherHashFingerprint: req.body.fatherHashFingerprint,
            fatherName: req.body.fatherName,
            doctorName: req.body.doctorName,
            countryCode: req.body.countryCode
        }];
        var strData = JSON.stringify(aData); 

        contract_sign.getBabyByHashFingerprint(strBabyHashFingerprint).then(function(transaction){
            if(transaction._registeredName == ""){
                
                var sendPromise = contract_sign.registerBaby(strRegisteredName, strBabyHashFingerprint,uintGenero, uintBirthDay, strData, addrHospitalAddress);
                sendPromise.then(function(transaction){
                    babies.push({
                        result: "OK",
                        tx_hash: transaction.hash
                    });
                    res.status(200).send(babies); 
                });
            }else{
                babies.push({
                    result: "OK",
                    message: "The baby is already registered in blockchain."
                });
                res.status(200).send(babies); 
            }
        });
    } 
    catch(error)
    {
        babies.push({
            result: "ERROR",
            error: error
        });
        res.status(500).send(babies); 
    }
});


//Devuelve el registro del bebe por el hash256
router.get("/babies/:babyHashFingerprint", function(req, res) {
    var babies = [];
    try {
        var babyHashFingerprint = req.params.babyHashFingerprint;

        contract_sign.getBabyByHashFingerprint(babyHashFingerprint).then(function(transaction){
            if(transaction._registeredName != ""){
                var aData = JSON.parse(transaction._data);

                babies.push({
                    result: "OK",
                    registeredName: transaction._registeredName,
                    genero: transaction._genero.toString(),
                    birthDay: transaction._birthDay.toString(),
                    timeStamp: transaction._timeStamp.toString(),
                    hospitalAddress: transaction._hospitalAddress,
                    motherHashFingerprint: aData[0].motherHashFingerprint,
                    motherName: aData[0].motherName,
                    fatherHashFingerprint: aData[0].fatherHashFingerprint,
                    fatherName: aData[0].fatherName,
                    doctorName: aData[0].doctorName,
                    countryCode: aData[0].countryCode 
                });

            }else{
                babies.push({
                    result: "ERROR",
                    message: "The baby is not registered in blockchain."
                });
            }
            res.status(200).send(babies); 
        }); 
    } 
    catch(error)
    {
        babies.push({
            result: "ERROR",
            error: error
        });
        res.status(500).send(babies); 
    }
});

module.exports = router;
