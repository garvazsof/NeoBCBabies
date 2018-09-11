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
        // uint256 babyHashFingerprint;
        uint256 motherHashFingerprint;
        string motherName;
        address hospitalAddress;
        Genero genero;
        uint birthDay;
        uint timeStamp;
    }

    mapping(uint256 => BabyRegistration) public listOfBabies;  

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
        string _registeredName, uint256 _babyHashFingerprint,  uint256 _motherHashFingerprint, string _motherName,
        address _hospitalAddress, uint8 _genero, uint _birthDay
    )  public {
        //TODO: require=> validaciones antes de guardar.
        uint _timeStamp = block.timestamp;

        // uint8 indexChild = 0;

        _registerBaby(
            _registeredName, _babyHashFingerprint, _motherHashFingerprint, _motherName, _hospitalAddress, 
            _genero, _birthDay, _timeStamp); 

        emit resultRegister(_registeredName, _timeStamp);
    }

    function _registerBaby(
        string _registeredName, uint256 _babyHashFingerprint,  uint256 _motherHashFingerprint, string _motherName,
        address _hospitalAddress, uint8 _genero, uint _birthDay, uint _timeStamp 
    )  private {
    
        listOfBabies[_babyHashFingerprint] = BabyRegistration({
            registeredName: _registeredName,
            // babyHashFingerprint: _babyHashFingerprint,
            motherHashFingerprint: _motherHashFingerprint,
            motherName: _motherName,
            hospitalAddress: _hospitalAddress,
            genero: Genero(_genero),
            birthDay: _birthDay,
            timeStamp: _timeStamp
        });
    }

    function getBabyByHashFingerprint(uint256 _babyHashFingerprint) public view returns(string registeredName, uint256 motherHashFingerprint,
    string motherName, address hospitalAddress, uint8 genero, uint birthDay, uint timeStamp) 
    {
        return(
            listOfBabies[_babyHashFingerprint].registeredName, 
            listOfBabies[_babyHashFingerprint].motherHashFingerprint, 
            listOfBabies[_babyHashFingerprint].motherName, 
            listOfBabies[_babyHashFingerprint].hospitalAddress, 
            uint8(listOfBabies[_babyHashFingerprint].genero), 
            listOfBabies[_babyHashFingerprint].birthDay,
            listOfBabies[_babyHashFingerprint].timeStamp);
    }

    function getCommunityName() public view returns (string){
        return communityName;
    }

    function setCommunityName(string _communityName) public {
        communityName = _communityName;
    }

    //Unicamente el owner
    modifier onlyOwner() {
        require(owner != msg.sender,  "Sender not authorized.");
        _;
    }
}