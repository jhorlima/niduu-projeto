const cors = require('cors');
const error = require('./config/error');
const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const functions = require('firebase-functions');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

if (!isProduction) {
    app.use(errorhandler());
}

app.use(require('./routes'));

error(app, isProduction);

exports.app = functions.https.onRequest(app);
