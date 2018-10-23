'use strict'
var express = require("express");
var router = express.Router();
var ipfsAPI = require('ipfs-api');
var config = require("../config");
// -----------------------------------
// connect to ipfs daemon API server
var ipfs = ipfsAPI(config.ipfs.domain, config.ipfs.port, {protocol: config.ipfs.protocol });
// -----------------------------------
var ethers = require('ethers');
// var provider = ethers.providers.getDefaultProvider('ropsten');
var etherscanProvider = new ethers.providers.EtherscanProvider("ropsten");
// -----------------------------------
//wallet para transacciones
var wallet = new ethers.Wallet(config.ethereum.privateKey,etherscanProvider);
var contract_sign = new ethers.Contract(config.ethereum.contractAddress, config.ethereum.abi, wallet);

//Todas las transacciones, filtrados por address account
router.get("/babies/transactions/:addressAccount", function(req, res) {
    var babies = [];
    var addressAccount = req.params.addressAccount;

    etherscanProvider.getHistory(config.ethereum.contractAddress).then(function(history) {
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
    var callPromise = contract_sign.getCommunityName();

    callPromise.then(function(result){
        babies.push({
            result: "OK",
            value: result
        });
        res.status(200).send(babies); 
    });
});
    
//Set del nombre de la institucion
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
router.post("/babies/", async function(req, res) {
    var babies = [];
    try
    {
        var strBabyHashFingerprint = req.body.babyHashFingerprint;
        var strRegisteredName = req.body.registeredName;
        var uintGenero = req.body.genero;
        var uintBirthDay = req.body.birthDay;
        var addrHospitalAddress = req.body.hospitalAddress;

        //TODO: Send to IPFS Server
        var strImgMotherFront = req.body.imgMotherFront;
        var strImgFatherFront = req.body.imgFatherFront;
        var strImgMotherBack = req.body.imgMotherBack;
        var strFatherBack = req.body.imgFatherBack;

        var buffer_imgMotherFront = new Buffer(strImgMotherFront, 'base64');
        var buffer_imgFatherFront= new Buffer(strImgFatherFront, 'base64');
        var buffer_imgMotherBack = new Buffer(strImgMotherBack, 'base64');
        var buffer_imgFatherBack = new Buffer(strFatherBack, 'base64');

        var files = [
            {
            path: "ImgMotherFront",
            content: buffer_imgMotherFront
            },
            {
                path: "ImgFatherFront",
                content: buffer_imgFatherFront
            },
            {
                path: "ImgMotherBack",
                content: buffer_imgMotherBack
            },
            {
                path: "FatherBack",
                content: buffer_imgFatherBack
            }
        ];

        const result_ipfs = await ipfs.files.add(files);

        var aData = [{
            motherHashFingerprint: req.body.motherHashFingerprint,
            motherName: req.body.motherName,
            fatherHashFingerprint: req.body.fatherHashFingerprint,
            fatherName: req.body.fatherName,
            doctorName: req.body.doctorName,
            countryCode: req.body.countryCode,
            ipfs_files: result_ipfs
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
                    countryCode: aData[0].countryCode,
                    ipfs_files: aData[0].ipfs_files
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
