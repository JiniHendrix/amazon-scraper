const express = require('express');
const scrapeBestSellersList = require('./controllers/scraper');

const app = express();

app.get('/scrape', scrapeBestSellersList);

app.listen(3001, () => {
  console.log('Server is listening on port 3001 dude');
});
