const { Pool } = require('pg');
require ('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
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