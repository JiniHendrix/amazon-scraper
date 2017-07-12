const cheerio = require('cheerio');
const request = require('request');
const uselessCategories = require('../utils/useless-categories');
const Item = require('../utils/itemClass');

function digDown(url, count = 2) {
  // get list of li links
  const ul = ' ul'.repeat(count);
  request(url, (err, response, body) => {
    const $ = cheerio.load(body);
    const list = $(`#zg_browseRoot${ul}`).find('li');
    if (list.first().find('span').length === 1) {
      list.forEach((elem) => {
        console.log(elem);
      });
    }
    console.log(list.first().text());
  });
  // look to see if theres a span in the first li
  // call digDown on every link if not
  // call scrape on every link if so
}

// function scrape(url) {
//   request(url, (err, response, body) => {
//     const $ = cheerio.load(body);
//     const list = $('#zg_browseRoot ul').find('li');
//   });
// }

module.exports = (req, res) => {
  request('https://www.amazon.com/Best-Sellers/zgbs/ref=zg_bsms_tab',
    (err, response, body) => {
      const $ = cheerio.load(body);
      $('#zg_browseRoot ul').find('li').each(
        (i, elem) => {
          const title = $(elem).text();
          if (uselessCategories.indexOf(title.toLowerCase()) === -1) {
            digDown($(elem).find('a').attr('href'));
          }
        });
    });
};


// scrape and put serialized JSON into a file
// serve that file on button click.

// REQUIREMENTS
// $10 - $50
// under 4lbs
// BSR of 5000 or less


// categories are nested arbitrarily deep so i need to recursively go through the lists
// need to find out how to know when i'm at a lowest level
// or just go through every page?
// maybe i can sell this shit.
// create an actual website that i charge for people to provide access
// holy shit this could be legit
// actual website that i update every so often etc.
// have articles and stuff on how to make money selling on amazon with all the basics covered
// and then sell this access to a webpage with this list
