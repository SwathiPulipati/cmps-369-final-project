const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./db');
const db = new Database();
db.initialize();

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/', require('./routes/accounts'))
app.use('/', require('./routes/contacts'))
app.use('/', (req, res) => {
    console.log("home")
    res.render('home', {contacts: []});
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})