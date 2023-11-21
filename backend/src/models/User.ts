const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Importando a instância configurada

class User extends Model {}

User.init({
  // definição do modelo
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password_hash: DataTypes.STRING
}, {
  sequelize, // Passando a instância
  modelName: 'User'
});

module.exports = User;