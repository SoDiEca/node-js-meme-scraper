import fs from 'node:fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import request from 'request';

// import fetch from 'node-fetch';
// const fs = require('node:fs');
// const cheerio = require('cheerio');
// const request = require('request');

request(
  'https://memegen-link-examples-upleveled.netlify.app/',
  (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);
      const memesLinks = [];
      $('img').each((index, element) => {
        const memeUrl = $(element).attr('src');
        memesLinks.push(memeUrl);
      });
      const urlsArray = memesLinks.slice(0, 10);

      const memeFile = './memes';
      if (!fs.existsSync(memeFile)) {
        fs.mkdirSync(memeFile);
      }

      for (let i = 0; i < urlsArray.length; i++) {
        const urlsDownload = async () => {
          try {
            const res = await fetch(urlsArray[i]);
            const buffer = await res.buffer();
            fs.writeFile(`./memes/meme-${i + 1}.jpg`, buffer, () => {
              console.log('Download successful');
            });
          } catch (err) {
            console.log('ERROR');
          }
        };
        urlsDownload();
      }
    }
  },
);
