pragma solidity ^0.4.23;

contract RegistrationOfBabies {

    // -----------------------
    // Variables
    // -----------------------

    //Definiciones de genero
    enum Genero {
        Undefined,
        Male,
        Female
    }

    //Evento para mostrar resultado de el registro
    event resultRegister (
       string registeredName,
       uint timeStamp
    );

    //Datos de registro de el bebe
    struct BabyRegistration {
        string registeredName;
        Genero genero;
        uint birthDay;
        uint timeStamp;
        string data;
        address hospitalAddress;      
    }

    mapping(bytes32 => BabyRegistration) private listOfBabies;  

    //Dueño de el contrato
    address owner;

    //Nombre de la entidad (Registro Civil | Servicio o Empresa)
    string communityName;

    // -----------------------
    //Funciones
    // -----------------------

    //Constructor del contrato
    constructor (string _communityName) public {
        owner = msg.sender;
        communityName = _communityName;
    }
	
     //Registro
    function registerBaby(
        string _registeredName, 
        bytes32 _babyHashFingerprint,  
        uint _genero,
        uint _birthDay,
        string _data,
        address _hospitalAddress
    )  public {
        //TODO: require=> validaciones antes de guardar.
        uint _timeStamp = block.timestamp;

        require(listOfBabies[_babyHashFingerprint].timeStamp == 0, "The baby has already been registered");

        listOfBabies[_babyHashFingerprint] = BabyRegistration({
            registeredName: _registeredName,
            genero: Genero(_genero),
            birthDay: _birthDay,
            timeStamp: _timeStamp,
            data: _data,
            hospitalAddress: _hospitalAddress           
        });

        emit resultRegister(_registeredName, _timeStamp);
    }

    

    function getBabyByHashFingerprint(bytes32 _babyHashFingerprint) public view returns
    (
        string _registeredName, 
        uint _genero,
        uint _birthDay,
        uint _timeStamp,
        string _data,
        address _hospitalAddress    
    ) 
    {
        return(
            listOfBabies[_babyHashFingerprint].registeredName, 
            uint(listOfBabies[_babyHashFingerprint].genero),
            listOfBabies[_babyHashFingerprint].birthDay, 
            listOfBabies[_babyHashFingerprint].timeStamp, 
            listOfBabies[_babyHashFingerprint].data,
            listOfBabies[_babyHashFingerprint].hospitalAddress);
    }

    function getCommunityName() public view returns (string){
        return communityName;
    }

    function setCommunityName(string _communityName) public onlyOwner {
        communityName = _communityName;
    }

    //Unicamente el owner
    modifier onlyOwner() {
        require(owner != msg.sender,  "Sender not authorized.");
        _;
    }
}