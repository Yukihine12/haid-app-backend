require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth') 

const app = express();
const port = 3000;
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server API berjalan di http://localhost:${port}`);
});