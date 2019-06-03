module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        ID: {type: type.INTEGER, primaryKey: true, autoIncrement: true},
        Name: type.STRING,
        Email: type.STRING,
        Password: type.STRING
    });
}