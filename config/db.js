const { Pool } = require('pg');
require ('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Tes koneksi saat pertama kali dijalankan
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Gagal terhubung ke database PostgreSQL:', err.message);
    } else {
        // 'res.rows[0].now' akan berisi waktu server database
        console.log('Berhasil terhubung ke database PostgreSQL!');
    }
});
// Ekspor "pool" ini agar bisa dipakai di file lain (terutama di Controller)
module.exports = pool;