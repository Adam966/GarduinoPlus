module.exports = (sequelize, type) => {
    return sequelize.define('plantcare', {
        ArduinoSerial: {type: type.STRING, primaryKey: true},
        IDUser: {type: type.INTEGER, foreignKey: true},
        PlantID: type.INTEGER,
        PlantName: type.STRING,
        TempMin: type.INTEGER,
        TempMax: type.INTEGER,
        AirHumMin: type.INTEGER,
        AirHumMax: type.INTEGER,
        SoilHumMin: type.INTEGER,
        SoilHumMax: type.INTEGER
    });
}