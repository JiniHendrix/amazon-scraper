const cheerio = require('cheerio');
const request = require('request');
const uselessCategories = require('../utils/useless-categories');
const Item = require('../utils/itemClass');

const items = [];
let timer = 0;

function randTime() {
  return Math.floor(((Math.random() * 5) + 5) * 1000);
}

function scrape($) {
  const items = $('.zg_itemImmersion');
  items.each((i, elem) => {
    const price = Number($(elem).find('.p13n-sc-price').text().slice(1));

    if (price >= 10 && price <= 50) {
      const name = $(elem).find('.p13n-sc-truncated-hyphen').text();
      const link = `https://www.amazon.com${$(elem).find('a').attr('href')}`;
      const testLink = 'https://www.amazon.com/UFO-SPINNER-Spinner-Stainless-Precision/dp/B06Y5HW7C9/ref=zg_bs_toys-and-games_home_3?_encoding=UTF8&psc=1&refRID=1QKF1KYEXWQ5TVKKD780';

      const getProdInfo = (url) => {
        request(url,
          (err, response, body) => {
            const $ = cheerio.load(body);
            const info = $('.prodDetTable tr');
            const weight = $(info).eq(1).find('td').text()
              .replace('\n', '')
              .trim();
            console.log('weight:', weight);
            const split = weight.split(' ');

            if (split[1].indexOf('pounds') > -1) {
              if (Number(split[0]) > 4) {

              }
            } else {

            }
          });
      };
      setTimeout(getProdInfo.bind(null, testLink), timer += randTime);
    }
  });
}

request('https://www.amazon.com/Best-Sellers-Arts-Crafts-Sewing-Beading-Supplies/zgbs/arts-crafts/8090707011/ref=zg_bs_nav_ac_2_12896081',
  (err, response, body) => {
    scrape(cheerio.load(body));
  });


function digDown(url, count = 2) {
  // get list of li links
  const ul = ' ul'.repeat(count);

  request(url,
    (err, response, body) => {
      const $ = cheerio.load(body);
      const list = $(`#zg_browseRoot${ul}`).find('li');

      if (list.first().find('span').length === 1) {
        list.each((i, elem) => {
          // for first element just scrape
          const callScraper = ($, elem) => {
            if (i === 0) {
              scrape($);
            } else {
              // 2nd and on follow link for next list item and pass into scraper
              request($(elem).find('a').attr('href'),
                (err, response, body) => {
                  scrape(cheerio.load(body));
                });
            }
          };
          setTimeout(callScraper.bind(null, $, elem), timer += randTime());
        });
      } else {
        list.each((i, elem) => {
          const timedOut = ($, elem) => {
            digDown($(elem).find('a').attr('href'), count + 1);
          };
          setTimeout(timedOut.bind(null, $, elem), timer += randTime());
        });
      }
    });
  // look to see if theres a span in the first li
  // call digDown on every link if not
  // call scrape on every link if so
}


const scrapeBestSellersList = () => {
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

module.exports = scrapeBestSellersList;

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
