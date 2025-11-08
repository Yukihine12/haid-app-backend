const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ message: 'Akses ditolak. Tidak ada token.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'kunci_rahasia_sangat_aman');
        req.user = decoded.user;
        next();

    } catch (err) {
        res.status(401).send({ message: 'Token tidak valid.' });
    }
};

module.exports = authMiddleware;