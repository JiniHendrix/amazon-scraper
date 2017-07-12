const express = require('express');
const scraper = require('./controllers/scraper');

const app = express();

app.get('/scrape', scraper);

app.listen(3001, () => {
  console.log('Server is listening on port 3001 dude');
});
