'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true} ,
    name: DataTypes.STRING,
    id_hospital: DataTypes.INTEGER,
    lastname: DataTypes.STRING,
    secondlastname: DataTypes.STRING,
    profesionalid: DataTypes.STRING,
    bcaddress: DataTypes.STRING
  }, {});
  Doctor.associate = function(models) {
    // associations can be defined here
  };
  return Doctor;
};