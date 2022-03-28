import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const CustMaster = sequelize.define('custmast', {
   CustName: {
      type: Sequelize.STRING
   },
   MobileNo: {
      type: Sequelize.STRING,
   },
   Add1: {
      type: Sequelize.STRING,
   },
   Add2: {
      type: Sequelize.STRING,
   },
   Add3: {
      type: Sequelize.STRING,
   },
   datestamp: {
      type: Sequelize.STRING,
   },
}, {
   timestamps: false,
   freezeTableName: true,
});
CustMaster.removeAttribute('id');

export default CustMaster;