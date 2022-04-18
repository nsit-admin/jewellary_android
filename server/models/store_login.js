import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const StoreLogin = sequelize.define('store_login', {
   srNo: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   mobileNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   password: {
      type: Sequelize.STRING,
   },
   createdDt: {
      type: Sequelize.STRING, 
   },
   updatedDt: {
      type: Sequelize.STRING,
   },
}, {
   timestamps: false,
   freezeTableName: true,
});

export default StoreLogin;