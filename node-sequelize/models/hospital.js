'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital', {
    id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true} ,
    name: DataTypes.STRING,
    rfc: DataTypes.STRING,
    registrynumber: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    bcaddress: DataTypes.STRING
  }, {});
  Hospital.associate = function(models) {
    // associations can be defined here
  };
  return Hospital;
};