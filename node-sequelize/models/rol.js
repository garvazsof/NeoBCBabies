'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
    id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true} ,
    description: DataTypes.STRING
  }, {});
  Rol.associate = function(models) {
    // associations can be defined here
  };
  return Rol;
};