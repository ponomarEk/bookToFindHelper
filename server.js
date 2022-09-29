const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

app.get('/add-to-list', function(req, res) {
    const { nameOfBook } = req.query;
    try {
      (async () => {
        const browser = await puppeteer.launch({
          headless: false,
          slowMo: 100, 
          args: [
            '--window-size=1920,1080',
          ],
          defaultViewport: {
            width:1920,
            height:1080
          }
        })
        const page = await browser.newPage();
        
        await page.goto('https://www.amazon.com');
    
        await page.type('#twotabsearchtextbox', `${nameOfBook}`);

        await page.click('input.nav-input');

        await page.click('#nav-search-submit-button')
    
        await page.waitForSelector('.s-result-list');
    
        const books = await page.$$('a.a-link-normal.a-text-normal');
        const navigationPromise = page.waitForNavigation();

        await books[1].click();

        await navigationPromise;

        await page.click('a[title="Add to List"]');
    
      })()
    } catch (err) {
      console.error(err)
    }
  });

app.listen(5000);