module.exports = (sequelize, type) => {
    return sequelize.define('plantinfo', {
        ID: {type: type.INTEGER, primaryKey: true, autoIncrement: true},
        ArduinoSerial: {type:type.STRING, foreignKey:true},
        Temp: type.FLOAT,
        AirHum: type.FLOAT,
        SoilHum: type.FLOAT,
        WatSurf: type.FLOAT,
        Date: type.DATE
    });
}