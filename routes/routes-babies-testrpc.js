//Test in RPC with web3

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var contractAdd = '0xd9a9d8be9d21393f84e83e02cc11bb6705b8e988';
var CONTRACT = new web3.eth.Contract([{"constant":false,"inputs":[{"name":"_registeredName","type":"string"},{"name":"_babyHashFingerprint","type":"uint256"},{"name":"_motherHashFingerprint","type":"uint256"},{"name":"_motherName","type":"string"},{"name":"_hospitalAddress","type":"address"},{"name":"_genero","type":"uint8"},{"name":"_birthDay","type":"uint256"}],"name":"registerBaby","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCommunityName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"listOfBabies","outputs":[{"name":"registeredName","type":"string"},{"name":"motherHashFingerprint","type":"uint256"},{"name":"motherName","type":"string"},{"name":"hospitalAddress","type":"address"},{"name":"genero","type":"uint8"},{"name":"birthDay","type":"uint256"},{"name":"timeStamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_babyHashFingerprint","type":"uint256"}],"name":"getBabyByHashFingerprint","outputs":[{"name":"registeredName","type":"string"},{"name":"motherHashFingerprint","type":"uint256"},{"name":"motherName","type":"string"},{"name":"hospitalAddress","type":"address"},{"name":"genero","type":"uint8"},{"name":"birthDay","type":"uint256"},{"name":"timeStamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_communityName","type":"string"}],"name":"setCommunityName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_communityName","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"registeredName","type":"string"},{"indexed":false,"name":"timeStamp","type":"uint256"}],"name":"resultRegister","type":"event"}]);
CONTRACT.options.address = contractAdd;

var defaultAccount = '0x52018daae84f6194b25e2391c420dca0e9f71c7d';

var appRouter = function (app) {
    

    // -----------------
    // COMMUNITY NAME
    // -----------------
    app.get("/API/babies/getCommunityName/", function(req, res) {
        var babies = [];
        CONTRACT.methods.getCommunityName().call(
        {
            from: defaultAccount
        }
        ,function(error, result){
            
            if(!error){
                babies.push({
                    result: "OK",
                    communityName:result
                });
            }else{
                babies.push({
                    error: error
                });
            }
            res.status(200).send(babies)
        });
    });
    
    app.post("/API/babies/setCommunityName/", function(req, res) {
        var babies = [];
        var communityName = req.body.communityName;

        CONTRACT.methods.setCommunityName(communityName).send(
        {
            from: defaultAccount,
            gasLimit:3000000,
            gas:3000000
        }
        ,function(error, result){          
            if(!error){
                babies.push({
                    result: "OK"
                });
            }else{
                babies.push({
                    error: error
                });
            }
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
                
        CONTRACT.methods.registerBaby(strRegisteredName, uintBabyHashFingerprint, uintMotherHashFingerprint,strMotherName,
            addrhospitalAddress, uintGenero, uintBirthDay).send(
        {
            from: defaultAccount,
            gasLimit:3000000,
            gas:3000000
        }
        ,function(error, result){          
            if(!error){
                babies.push({
                    result: "OK",
                    tx: result
                });
            }else{
                babies.push({
                    error: error
                });
            }

            res.status(200).send(babies);
        });
    });

    app.post("/API/babies/registerV2/", function(req, res) {
        var babies = [];
        var strRegisteredName = req.body.registeredName;
        var uintBabyHashFingerprint = req.body.babyHashFingerprint;
        var uintMotherHashFingerprint = req.body.motherHashFingerprint;
        var strMotherName = req.body.motherName;
        
        //News
        var uintFatherHashFingerprint = req.body.fatherHashFingerprint;
        var strFatherrName = req.body.fatherName;
        var strDoctorName = req.body.doctorName;
        var strCountryCode = req.body.countryCode;
        
        var addrhospitalAddress = req.body.hospitalAddress;
        var uintGenero = req.body.genero;
        var uintBirthDay = req.body.birthDay;
                
        //News IMG:
        //News
         var strImgMother = req.body.imgMotherFront;
         var strImgFather = req.body.imgFatherFront; 
         var strImgMotherBack = req.body.imgMotherBack;
         var strImgFatherBack = req.body.imgFatherBack;

        //TODO: Update line
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