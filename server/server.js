const express = require('express');
const scraper = require('./controllers/scraper');

const app = express();

app.get('/', scraper);

app.listen(3001);