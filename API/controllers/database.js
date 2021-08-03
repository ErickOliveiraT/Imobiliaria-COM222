const mysql = require('mysql');
const secrets = require('../credentials');

async function getConnection() {
    return mysql.createConnection({
        host: secrets.MYSQL_HOST,
        user: secrets.MYSQL_USER,
        password: secrets.MYSQL_PASS,
        database: secrets.MYSQL_DATABASE
    });
}

module.exports = {getConnection}