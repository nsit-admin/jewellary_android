import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ght_new_tmp', 'ghtadmin', 'Ght54321', {
    dialect: 'mysql',
    host: 'ght.cskltshvmkbk.ap-south-1.rds.amazonaws.com', 
});


// const sequelize = new Sequelize('ght', 'admin', 'Pabbu123', {
//     dialect: 'mysql',
//     host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com', 
// });
export default sequelize;
