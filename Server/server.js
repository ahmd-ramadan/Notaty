const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpStatusText = require('./utils/httpStatusText');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config() 

const mongodb_url =  process.env.MONGODB_URL;
mongoose.connect(mongodb_url).then(() => {
    console.log('mongoose server started')
})


const notesRouter = require('./routes/notes-routs')
app.use('/notes', notesRouter);

app.all('*', (req, res, next) => {
    return res.status(400).json({status: httpStatusText.ERROR, message: 'This resourse is not available'})
})

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        code: error.statusCode || 500,
        message: error.message || "Error",
        data: null,
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening On Port ${PORT}`);
})

