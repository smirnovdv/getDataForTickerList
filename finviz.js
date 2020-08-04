const puppeeter = require('puppeteer');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const ObjectsToCsv = require('objects-to-csv');
const dataArray = [];

async function scrapFinviz(tickers) {
  const browser = await puppeeter.launch({headless: false});
  const page = await browser.newPage();
  for (let i = 0; i < tickers.length; i++) {
    let data = {};
    console.log(`https://finviz.com/quote.ashx?t=${tickers[i][ '﻿Symbol']}`)
    await page.setDefaultNavigationTimeout(0);
    await page.goto(`https://finviz.com/quote.ashx?t=${tickers[i][ '﻿Symbol']}`);
    data.ticker = tickers[i][ '﻿Symbol']
    data.mcap = await page.$eval(`body > table:nth-child(5) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > b`, e => e.innerText).catch(console.error);
    data.ernDate = await page.$eval(`body > table:nth-child(5) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td > table > tbody > tr:nth-child(11) > td:nth-child(6) > b`, e => e.innerText).catch(console.error);
    data.instOwn = await page.$eval(`body > table:nth-child(5) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td > table > tbody > tr:nth-child(3) > td:nth-child(8) > b`, e => e.innerText).catch(console.error);
    data.float = await page.$eval(`body > table:nth-child(5) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td > table > tbody > tr:nth-child(2) > td:nth-child(10) > b`, e => e.innerText).catch(console.error);
    data.income = await page.$eval(`body > table:nth-child(5) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > b`, e => e.innerText).catch(console.error);
    data.insiderOwn = await page.$eval(`body > table:nth-child(5) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td > table > tbody > tr:nth-child(1) > td:nth-child(8) > b `, e => e.innerText).catch(console.error);
    //data.lastNews =  await page.$eval(`#news-table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div.news-link-left > a`, e => e.innerText);
    //data.lastNewsDate = await page.$eval(`#news-table > tbody > tr:nth-child(1) > td:nth-child(1)`, e => e.innerText);
    dataArray.push(data); //TODO: right to scv here
    
    const csv = new ObjectsToCsv(dataArray);
 
    // Save to file:
    await csv.toDisk('./test.csv');
   
    // Return the CSV file as string:
    console.log(await csv.toString());
    
  };
  await browser.close();
  console.log(dataArray)
};

fs.createReadStream('ts-report.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    scrapFinviz(results)
  });




//scrapFinviz('MIST');