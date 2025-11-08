const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tes koneksi saat pertama kali dijalankan
pool.getConnection()
    .then(connection => {
        console.log('Berhasil terhubung ke database MariaDB!');
        connection.release();
    })
    .catch(err => {
        console.error('Gagal terhubung ke database:', err.message);
    });

// Ekspor "pool" ini agar bisa dipakai di file lain (terutama di Controller)
module.exports = pool;