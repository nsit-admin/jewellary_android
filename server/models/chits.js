import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const Chits = sequelize.define('chits', {
   trno: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   yrtrno: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   trdate: {
      type: Sequelize.STRING,
   },
   CustName: {
      type: Sequelize.STRING,
      allowNull: false,
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
   ICCode: {
      type: Sequelize.STRING,
   },
   STCode: {
      type: Sequelize.STRING,
   },
   NoI: {
      type: Sequelize.STRING,
   },
   InstAmt: {
      type: Sequelize.STRING,
   },
   Bonus: {
      type: Sequelize.STRING,
   },
   Remarks: {
      type: Sequelize.STRING,
   },
   Amt: {
      type: Sequelize.STRING,
   },
   Wt: {
      type: Sequelize.STRING,
   },
   ClDate: {
      type: Sequelize.STRING,
   },
   SetType: {
      type: Sequelize.STRING,
   },
   UserCode1: {
      type: Sequelize.INTEGER,
   },
   UserCode2: {
      type: Sequelize.INTEGER,
   },
   DateStamp: {
      type: Sequelize.STRING,
   },
   InstPaid: {
      type: Sequelize.INTEGER,
   },
   RefNo: {
      type: Sequelize.STRING,
   },
   AccWt: {
      type: Sequelize.STRING,
   },
   ClAmt: {
      type: Sequelize.STRING,
   },
   SetNo: {
      type: Sequelize.STRING,
   },
   SendSMS: {
      type: Sequelize.STRING,
   },
   DoB: {
      type: Sequelize.STRING,
   },
   DoW: {
      type: Sequelize.STRING,
   },
   ChildName1: {
      type: Sequelize.STRING,
   },
   ChildDoB1: {
      type: Sequelize.STRING,
   },
   ChildName2: {
      type: Sequelize.STRING,
   },
   ChildDoB2: {
      type: Sequelize.STRING,
   },
   Amt2: {
      type: Sequelize.STRING,
   },
}, {
   timestamps: false,
   freezeTableName: true,
});

export default Chits;