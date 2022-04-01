import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const OTP = sequelize.define('otp', {
   sno: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   mobileNumber: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   otp_code: {
      type: Sequelize.STRING,
   },
   otp_expiry: {
      type: Sequelize.STRING, 
   },
   no_of_tries: {
      type: Sequelize.STRING, 
   },
   created_dt: {
      type: Sequelize.STRING,
   },
   updated_dt: {
      type: Sequelize.STRING,
   },
}, {
   timestamps: false,
   freezeTableName: true,
});

export default OTP;