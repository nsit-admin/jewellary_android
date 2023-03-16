import { Sequelize } from 'sequelize';

import sequelize from '../utils/database.js';

const payment_details = sequelize.define('payment_details', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   customer_phone: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   customer_chit_no: {
      type: Sequelize.STRING,
   },
   chit_rec_id: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   order_id: {
      type: Sequelize.STRING,
   },
   tracking_id: {
      type: Sequelize.STRING,
   },
   bank_ref_no: {
      type: Sequelize.STRING,
   },
   order_status: {
      type: Sequelize.STRING,
   },
   payment_mode: {
      type: Sequelize.STRING,
   },
   status_message: {
      type: Sequelize.STRING,
   },
   currency: {
      type: Sequelize.STRING,
   },
   amount: {
      type: Sequelize.STRING,
   },
   trans_date: {
      type: Sequelize.STRING,
   },
   updated_date: {
      type: Sequelize.STRING,
   },
   created_date: {
      type: Sequelize.STRING,
   }
}, {
   timestamps: false,
   freezeTableName: true,
});

export default payment_details;