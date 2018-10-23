module.exports = {
    PORT: 3000,
    ethereum:{
        contractAddress: '0x141a34c1f5751c878226a51645d34785797a6385', //Ropsten Addres Contract (DLT Babies)
        abi: [{"constant":true,"inputs":[],"name":"getCommunityName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_communityName","type":"string"}],"name":"setCommunityName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_babyHashFingerprint","type":"bytes32"}],"name":"getBabyByHashFingerprint","outputs":[{"name":"_registeredName","type":"string"},{"name":"_genero","type":"uint256"},{"name":"_birthDay","type":"uint256"},{"name":"_timeStamp","type":"uint256"},{"name":"_data","type":"string"},{"name":"_hospitalAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_registeredName","type":"string"},{"name":"_babyHashFingerprint","type":"bytes32"},{"name":"_genero","type":"uint256"},{"name":"_birthDay","type":"uint256"},{"name":"_data","type":"string"},{"name":"_hospitalAddress","type":"address"}],"name":"registerBaby","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_communityName","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"registeredName","type":"string"},{"indexed":false,"name":"timeStamp","type":"uint256"}],"name":"resultRegister","type":"event"}],
        privateKey: '0x1AF0B7DD30D55DE69303C2DDCF7ABD654EA46AD44B50163307EF425CD8C316C5',

    },
    ipfs:{
        url: "https://ipfs.io/ipfs/",
        domain: 'ipfs.infura.io',
        port: '5001',
        protocol:'https'
    } 
}