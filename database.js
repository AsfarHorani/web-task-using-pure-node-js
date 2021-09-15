const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'my_task',
    password: '101021'
});

module.exports = pool.promise();