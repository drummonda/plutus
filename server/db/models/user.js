const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  nonce: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: () => Math.floor(Math.random() * 10000)
  },

  publicAddress: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isLowercase: true
    }
  },

  username: {
    type: Sequelize.STRING,
    unique: true
  }

})

module.exports = User
