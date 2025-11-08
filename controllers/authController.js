const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).send({ message: 'Email dan password tidak boleh kosong' });
        }
        const sqlCek = "SELECT ID FROM users WHERE email = $1";
        const { rows } = await pool.query(sqlCek, [email]);
        if (rows.length > 0) {
            return res.status(400).send({ message: 'Email sudah terdaftar. Silakan login.' });
        }
        const salt = await bcrypt.genSalt(10); 
        const password_hash = await bcrypt.hash(password, salt);
        const sqlInsert = "INSERT INTO users (email, password_hash) VALUES ($1, $2)";
        await pool.query(sqlInsert, [email, password_hash]);
        res.status(201).send({ message: 'User berhasil terdaftar!' });
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message : 'Server Error'});
    }
};

const login = async (req,res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).send({ message: 'Email dan password tidak boleh kosong' });
        }
        const sqlCek = "SELECT * FROM users WHERE email = $1";
        const { rows } = await pool.query(sqlCek, [email]);

        if (rows.length === 0) {
            return res.status(400).send({ message: 'Email atau password salah' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).send({ message: 'Email atau password salah' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            'kunci_rahasia_sangat_aman', 
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).send({ token: token });
            }
        );
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message : 'Server Error'});
    }
}

module.exports = {
    register,
    login,
}