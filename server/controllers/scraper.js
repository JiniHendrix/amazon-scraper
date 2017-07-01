const cheerio = require('cheerio');
const request = require('request');
const uselessCategories = require('../utils/useless-categories');

module.exports = (req, res) => {
  request('https://www.amazon.com/Best-Sellers/zgbs/ref=zg_bsms_tab',
    (err, response, body) => {
      const $ = cheerio.load(body);
      $('#zg_browseRoot ul').find('li').each(
        (i, elem) => {
          const title = $(elem).text();
          if (uselessCategories.indexOf(title.toLowerCase()) === -1) {
            console.log(title)
          }
        }
      );
    })

}

//categories are nested arbitrarily deep so i need to recursively go through the lists
//need to find out how to know when i'm at a lowest level
//or just go through every page?
//maybe i can sell this shit.
//create an actual website that i charge for people to provide access
//holy shit this could be legit
//actual website that i update every so often etc.
//have articles and stuff on how to make money selling on amazon with all the basics covered
//and then sell this access to a webpage with this list