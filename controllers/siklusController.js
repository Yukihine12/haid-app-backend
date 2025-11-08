const pool = require('../config/db');

const getApiTest = async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT 1 + 1 AS solution'); 
        res.send(`API Terhubung ke DB! Hasil tes: 1 + 1 = ${rows[0].solution}`);
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Gagal terhubung ke DB');
    }
};  
const catatSiklusBaru = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {tanggal_mulai, tanggal_selesai} = req.body;
        const sql = "INSERT INTO siklus (user_id, tanggal_mulai, tanggal_selesai) VALUES ($1, $2, $3)";
        await pool.query(sql, [user_id, tanggal_mulai, tanggal_selesai]);
        res.status(201).send({ message: 'Siklus baru berhasil dicatat!' });
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error: Gagal mencatat siklus' });
    }
};
const getPrediksi = async (req, res) => {
    try {
        const sql = "SELECT tanggal_mulai, tanggal_selesai FROM siklus";
        const {rows} = await pool.query(sql);
        if (rows.length === 0) {
            return res.status(200).send({ prediksi_rata_rata: 28 });
        }
        let total_durasi = 0;
        for (const siklus of rows) {
            const tgl_selesai = new Date(siklus.tanggal_selesai);
            const tgl_mulai = new Date(siklus.tanggal_mulai);
            
            const selisih_milidetik = tgl_selesai - tgl_mulai;
            const durasi_hari = (selisih_milidetik / (1000 * 60 * 60 * 24)) + 1;
            total_durasi = total_durasi + durasi_hari;
        }
        const rata_rata = total_durasi / rows.length;
        res.status(200).send({ prediksi_rata_rata: rata_rata });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error: Gagal mengambil prediksi' });
    }
};
const gettAllsiklus = async (req,res) => {
    try {
        const user_id = req.user.id;
        const sql ='SELECT * from siklus WHERE user_id = $1';
        const {rows} = await pool.query(sql, [user_id]);
        res.status(200).send(rows);
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error: Gagal, data siklus tidak ditemukan' });
    }
};
const getSiklusById = async (req,res) => {
    try {
        const {id} = req.params;
        const sql = "SELECT * FROM siklus WHERE ID = $1";
        const {rows} = await pool.query(sql, [id]);
        if (rows.length === 0 ){
            return res.status(404).send({ message : 'Data siklus tidak ditemukan'});   
        }
        res.status(200).send(rows[0]);
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error' });
    }
};
const updateSiklus = async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal_mulai, tanggal_selesai } = req.body;
        const sql = "UPDATE siklus SET tanggal_mulai = $1, tanggal_selesai = $2 WHERE ID = $3";
        await pool.query(sql, [tanggal_mulai, tanggal_selesai, id]);
        res.status(200).send({ message: 'Data siklus berhasil di-update!' });
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error' });
    }
};
const deleteSiklus = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM siklus WHERE ID = $1";
        await pool.query(sql, [id]);
        res.status(200).send({ message: 'Data siklus berhasil dihapus!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error' });
    }
};
const catatLogHarian = async (req,res) => {
    try {
        const { siklus_id } = req.params;
        const { tanggal, data_json} = req.body;
        const data_json_string = JSON.stringify(data_json);
        const sql = `
            INSERT INTO log_harian (siklus_id, user_id, tanggal, data_json)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (siklus_id, tanggal) DO UPDATE SET
                data_json = EXCLUDED.data_json
        `;
        await pool.query(sql, [siklus_id, user_id, tanggal, data_json]);
        res.status(200).send({ message: "log harian berhasil dimasukkan!"})
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error' });
    }
};
const getLogHarian = async (req,res) => {
    try {
        const { siklus_id } = req.params;
        const sql = "SELECT * FROM log_harian WHERE siklus_id = $1 ORDER BY tanggal ASC";
        const {rows} = await pool.query(sql, [siklus_id]);
        res.status(200).send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error' });
    }
};
const HapusLogHarian = async (req,res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM log_harian WHERE ID = $1";
        const { rowCount } = await pool.query(sql, [id]);
        if (rowCount === 0) {
            return res.status(404).send({ message: 'Log tidak ditemukan, tidak ada yang dihapus' });
        }
        res.status(200).send({ message: 'Log harian berhasil dihapus!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Log tidak ditemukan'});
    }
}
module.exports = {
    getApiTest,
    catatSiklusBaru,
    getPrediksi,
    gettAllsiklus,
    getSiklusById,
    updateSiklus,
    deleteSiklus,
    catatLogHarian,
    getLogHarian,
    HapusLogHarian,
};