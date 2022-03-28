import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const ChitRec = sequelize.define('chitrec', {
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
   chitno: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   instno: {
      type: Sequelize.STRING,
   },
   instamt: {
      type: Sequelize.STRING,
   },
   rate: {
      type: Sequelize.STRING,
   },
   wt: {
      type: Sequelize.STRING,
   },
   remarks: {
      type: Sequelize.STRING,
   },
   cldate: {
      type: Sequelize.STRING,
   },
   UserCode1: {
      type: Sequelize.STRING,
   },
   UserCode2: {
      type: Sequelize.STRING,
   },
   DateStamp: {
      type: Sequelize.STRING,
   },
}, {
   timestamps: false,
   freezeTableName: true,
});

export default ChitRec;