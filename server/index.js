const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://cng-portal-iw9z.vercel.app',
        'https://cng-portal-iw9z-rexxerety-chandan-bansals-projects.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));

app.get('/', (req, res) => {
    res.send('CNG Portal API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
