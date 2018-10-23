// OBSOLETE


pragma solidity ^0.4.24;

contract bcbabies {
    uint256 storedFingerPrint;

    function set(uint256 fingerPrint) 
    public {
        storedFingerPrint = fingerPrint;
    }

    function get() 
    public
    view 
    returns (uint256) {
        return storedFingerPrint;
    }
}
