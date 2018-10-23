
// OBSOLETE

pragma solidity ^0.4.23;

contract RegistrationOfInfants {

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
        string hashFingerprint;
        address mothersAddress;
        // address fathersAddress;
        address hospitalAddress;
        Genero genero;
        uint birthDay;
        uint timeStamp;
    }

    //Mapeo del struct "address de la mama => mapeo de hijos"
    mapping(address => mapping (uint => BabyRegistration)) public listOfBabies;  

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
        string _registeredName, string _hashFingerprint,  address _mothersAddress, 
        address _hospitalAddress, uint8 _genero, uint _birthDay
    )  public {
        //TODO: require=> validaciones antes de guardar.
        uint _timeStamp = block.timestamp;

        uint8 indexChild = 0;

        _registerBaby(_registeredName, _hashFingerprint, _mothersAddress, _hospitalAddress, _genero, _birthDay, _timeStamp, indexChild); 

        emit resultRegister(_registeredName, _timeStamp);
    }

    function _registerBaby(
        string _registeredName, string _hashFingerprint,  address _mothersAddress, 
        address _hospitalAddress, uint8 _genero, uint _birthDay, uint _timeStamp, uint indexChild 
    )  private {
    
        listOfBabies[_mothersAddress][indexChild] = BabyRegistration({
            registeredName: _registeredName,
            hashFingerprint: _hashFingerprint,
            mothersAddress: _mothersAddress,
            hospitalAddress: _hospitalAddress,
            genero: Genero(_genero),
            birthDay: _birthDay,
            timeStamp: _timeStamp
        });
    }

    function getBabyByMotherAddress(address _motherAddress) public view returns(string registeredName, string hashFingerprint,
    address hospitalAddress, uint8 genero, uint birthDay, uint timeStamp) 
    {
        uint8 indexChild = 0;
        return(
            listOfBabies[_motherAddress][indexChild].registeredName, 
            listOfBabies[_motherAddress][indexChild].hashFingerprint, 
            // listOfBabies[_motherAddress][indexChild].mothersAddress, 
            listOfBabies[_motherAddress][indexChild].hospitalAddress, 
            uint8(listOfBabies[_motherAddress][indexChild].genero), 
            listOfBabies[_motherAddress][indexChild].birthDay,
            listOfBabies[_motherAddress][indexChild].timeStamp);
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
