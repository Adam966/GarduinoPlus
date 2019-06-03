const Sequelize = require('sequelize');
const plantInfoModel = require('./models/plantInfo')
const plantCareModel = require('./models/plantCare')
const usersModel = require('./models/users')

const sequelizeconn = new Sequelize('plant_databasev2', 'plantserver', 'akademiasovy', {
  host: 'localhost',
  dialect: 'mysql',
  port:3306,
  define: 
  {
    freezeTableName: true, 
    timestamps: false,
    underscored: false
  }
});

const plantInfo = plantInfoModel(sequelizeconn, Sequelize); 
const plantCare = plantCareModel(sequelizeconn, Sequelize); 
const users = usersModel(sequelizeconn, Sequelize); 

module.exports = {plantCare, plantInfo, users, sequelizeconn};