const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');


dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './environments/production.env' : './environments/development.env',
});

const contactRouter = require('./routes/contactRouter');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES
app.use('/api/contacts', contactRouter);

app.all('*', (req, res) => {
  res.status(404).json({
    message: "Oops, recource not found..."
  });
});

app.use((err, req, res, next) => {
  res.status(err.status||500).json({
    message: err.message
  });
});


module.exports = app