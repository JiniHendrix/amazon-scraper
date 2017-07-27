const cheerio = require('cheerio');
const request = require('request');
const uselessCategories = require('../utils/useless-categories');
const Item = require('../utils/itemClass');
const fs = require('fs');
const path = require('path');

const items = [];
let timer = 0;
let pending = 0;

function randTime() {
  return Math.floor(((Math.random() * 5) + 5) * 1000);
}

function cleanUp(str) {
  return str.replace('\n', '').trim();
}
function scrape($) {
  const products = $('.zg_itemImmersion');
  products.each((i, elem) => {
    const price = Number($(elem).find('.p13n-sc-price').text().slice(1));

    if (price >= 10 && price <= 50) {
      pending += 1;
      const prodName = cleanUp($(elem).find('.p13n-sc-truncated-hyphen').text());
      const imgLink = $(elem).find('img').attr('src');
      const listingUrl = `https://www.amazon.com${$(elem).find('a').attr('href')}`;

      const getProdInfo = (listingUrl, imgLink, price, prodName) => {
        request(listingUrl,
          (err, response, body) => {
            const $ = cheerio.load(body);
            const info = $('.prodDetTable tr');
            let weight = cleanUp($(info).eq(1).find('td').text());
            const split = weight.split(' ');

            if (split[1].indexOf('pounds') > -1) {
              if (Number(split[0]) <= 4) {
                weight = `${split[0]} ${split[1]}`;
              } else {
                pending--;
                return;
              }
            } else {
              weight = `${split[0]} ${split[1]}`;
            }

            let rank;
            $(info).each((i, elem) => {
              const name = $(elem).find('th').text();
              if (name.indexOf('Rank') > -1) {
                rank = cleanUp($(elem).find('td').text().split('\\n')[0]);
              }
            });
            const dimensions = cleanUp($(info).eq(0).find('td').text());

            items.push(new Item(
              listingUrl,
              prodName,
              price,
              weight,
              dimensions,
              rank,
              imgLink));
            if (!--pending) {
              fs.writeFile(path.join(__dirname, '../../data/data'), JSON.stringify(items, null, 2));
            }
          });
      };
      setTimeout(getProdInfo.bind(null, listingUrl, imgLink, price, prodName), timer += randTime());
    }
  });
}

request('https://www.amazon.com/Best-Sellers-Arts-Crafts-Sewing-Beading-Supplies/zgbs/arts-crafts/8090707011/ref=zg_bs_nav_ac_2_12896081',
  (err, response, body) => {
    scrape(cheerio.load(body));
  });

function iteratePagination($, elem) {
  const callScraper = () => {
    const url = $(elem).attr('href');
    request(url, (err, response, body) => {
      scrape(cheerio.load(body));
    });
  };
  $(elem).find('.zg_pagination a').each((i, elem) => {
    if (i !== 0) {
      setTimeout(callScraper.bind(null, $, elem), timer += randTime());
    }
  });
}

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
              iteratePagination($, elem);
            } else {
              // 2nd and on follow link for next list item and pass into scraper
              request($(elem).find('a').attr('href'),
                (err, response, body) => {
                  scrape(cheerio.load(body));
                  iteratePagination($, elem);
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
