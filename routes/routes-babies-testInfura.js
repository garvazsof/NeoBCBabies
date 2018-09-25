//Test in Infura with ethers.js
//Signed transaction

var ethers = require('ethers');
var provider = ethers.providers.getDefaultProvider('ropsten');

var contractAddress  = '0x492ac64c927bd9da956b981228ca839ffb09d8f6';
var abi = [{"constant":false,"inputs":[{"name":"_registeredName","type":"string"},{"name":"_babyHashFingerprint","type":"uint256"},{"name":"_motherHashFingerprint","type":"uint256"},{"name":"_motherName","type":"string"},{"name":"_hospitalAddress","type":"address"},{"name":"_genero","type":"uint8"},{"name":"_birthDay","type":"uint256"}],"name":"registerBaby","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCommunityName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"listOfBabies","outputs":[{"name":"registeredName","type":"string"},{"name":"motherHashFingerprint","type":"uint256"},{"name":"motherName","type":"string"},{"name":"hospitalAddress","type":"address"},{"name":"genero","type":"uint8"},{"name":"birthDay","type":"uint256"},{"name":"timeStamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_babyHashFingerprint","type":"uint256"}],"name":"getBabyByHashFingerprint","outputs":[{"name":"registeredName","type":"string"},{"name":"motherHashFingerprint","type":"uint256"},{"name":"motherName","type":"string"},{"name":"hospitalAddress","type":"address"},{"name":"genero","type":"uint8"},{"name":"birthDay","type":"uint256"},{"name":"timeStamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_communityName","type":"string"}],"name":"setCommunityName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_communityName","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"registeredName","type":"string"},{"indexed":false,"name":"timeStamp","type":"uint256"}],"name":"resultRegister","type":"event"}];

// TODO:  Cuenta de pruebas
var defaultAccount = '0xb483FB2160e53EF745C85F6A59781cE8f0DDC323';
var privateKey = '0x63BEC364759BFFB64AD052E09C70B31BDE7EB38071EFBAEE9C231E3AEEEA54BB';

//wallet para transacciones
var wallet = new ethers.Wallet(privateKey,provider);
var contract_sign = new ethers.Contract(contractAddress, abi, wallet);
var contract = new ethers.Contract(contractAddress, abi, provider);



var appRouter = function (app) {
    

    // -----------------
    // COMMUNITY NAME
    // -----------------
    app.get("/API/babies/getCommunityName/", function(req, res) {
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

    
    app.post("/API/babies/setCommunityName/", function(req, res) {
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

    // -----------------
    //  BABIES
    // -----------------
    app.post("/API/babies/register/", function(req, res) {
        var babies = [];
        var strRegisteredName = req.body.registeredName;
        var uintBabyHashFingerprint = req.body.babyHashFingerprint;
        var uintMotherHashFingerprint = req.body.motherHashFingerprint;
        var strMotherName = req.body.motherName;
        var addrhospitalAddress = req.body.hospitalAddress;
        var uintGenero = req.body.genero;
        var uintBirthDay = req.body.birthDay;
                
        var sendPromise = contract_sign.registerBaby(strRegisteredName, uintBabyHashFingerprint, uintMotherHashFingerprint,strMotherName,
            addrhospitalAddress, uintGenero, uintBirthDay);

        sendPromise.then(function(transaction){
            // console.log(transaction);
            babies.push({
                result: "OK",
                tx_hash: transaction.hash
            });
            res.status(200).send(babies); 
        }); 
        
    });

    app.post("/API/babies/registerV2/", function(req, res) {
        var babies = [];
        var strRegisteredName = req.body.registeredName;
        var uintBabyHashFingerprint = req.body.babyHashFingerprint;
        var uintMotherHashFingerprint = req.body.motherHashFingerprint;
        var strMotherName = req.body.motherName;
        var addrhospitalAddress = req.body.hospitalAddress;
        var uintGenero = req.body.genero;
        var uintBirthDay = req.body.birthDay;
                
        babies.push({
            result: "OK",
            tx: "0x095ff778fc19c1c9f5c7ecb213b4ea285cbf92dce25c8f89018f83276cae37a4"
        });

        res.status(200).send(babies);
        
    });

    app.get("/API/babies/getBabyByHashFingerprint/:babyHashFingerprint", function(req, res) {
        var babies = [];
        var babyHashFingerprint = req.params.babyHashFingerprint;

        CONTRACT.methods.getBabyByHashFingerprint(babyHashFingerprint).call(
        {
            from: defaultAccount
        }
        ,function(error, result){
            console.log(result);
            if(!error){
                babies.push({
                    result: "OK",
                    registeredName: result.registeredName,
                    motherHashFingerprint: result.motherHashFingerprint,
                    motherName: result.motherName,
                    hospitalAddress: result.hospitalAddress,
                    genero: result.genero,
                    birthDay: result.birthDay,
                    timeStamp: result.timeStamp
                });
            }else{
                babies.push({
                    error: error
                });
            }
            res.status(200).send(babies)
        });
    });

}

module.exports = appRouter;