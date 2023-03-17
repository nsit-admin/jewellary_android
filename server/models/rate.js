import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const rates = sequelize.define('rates', {
   DateTime: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
   },
   GoldRate22: {
      type: Sequelize.STRING,
   },
   GoldRate18: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   SilverRate: {
      type: Sequelize.STRING,
   },
   UserCode1: {
      type: Sequelize.STRING,
   },
   DateStamp: {
      type: Sequelize.STRING,
   },
}, {
   timestamps: false,
   freezeTableName: true,
});

export default rates;