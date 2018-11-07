const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const error = require('./config/error');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const functions = require('firebase-functions');
const serviceAccount = require("./config/niduu-1961d-firebase-adminsdk-tgmg8-aed6994dff.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://niduu-1961d.firebaseio.com"
});

const hooks = require('./hooks/index')(functions, admin);
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

Object.keys(hooks).forEach(key => {
    exports[key] = hooks[key];
});