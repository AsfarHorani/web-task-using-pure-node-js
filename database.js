const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
	waitForConnections: true,
    host: 'mysql-50451-0.cloudclusters.net',
    user: 'admin',
    database: 'mytask',
    password: 'qIF9DHz0',
     port: '19704',
});

module.exports = pool.promise();