const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const connection = require('./config/db');
const router = require('./routes/userRoutes');
const postRouter = require('./routes/postroutes');
const profileRouter = require('./routes/profileRoutes');
const adminRouter = require('./routes/adminRoutes');
const path = require('path');

const app = express();

connection();
app.use(cors());
app.use(bodyParser.json());
app.use('/', router);
app.use('/', postRouter);
app.use('/', profileRouter);
app.use('/', adminRouter);

const PORT = process.env.PORT || 8000;

//production code
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build/')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    }); ///details/What-is-CSS this type of route not supoort in express directly
}

app.listen(PORT, () => {
    console.log(`App running on port no ${PORT}`);
})