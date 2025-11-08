const express = require('express');
const router = express.Router();
const siklusController = require('../controllers/siklusController');
const authMiddleware = require('../middleware/auth');// middleware pengecek token

router.get('/', siklusController.getApiTest);

router.post('/siklus', authMiddleware, siklusController.catatSiklusBaru);// nambahin silus baru
router.get('/prediksi',authMiddleware, siklusController.getPrediksi);
router.get('/SemuaSiklusHaid', authMiddleware, siklusController.gettAllsiklus);
router.get('/siklus/:id', authMiddleware, siklusController.getSiklusById);
router.put('/siklus/:id', authMiddleware, siklusController.updateSiklus);
router.delete('/siklus/:id', authMiddleware, siklusController.deleteSiklus);
// dibawah ini adalah endpoint untuk tabel log_harian.
router.post('/logharian/:siklus_id', authMiddleware, siklusController.catatLogHarian);
router.get('/logharian/:siklus_id', authMiddleware, siklusController.getLogHarian);
router.delete('/logharian/:id', authMiddleware, siklusController.HapusLogHarian);

module.exports = router;