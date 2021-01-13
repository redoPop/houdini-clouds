const path = require('path');
const puppeteer = require('puppeteer');
const helpers = require('./helpers');

const absPath = rel => path.join(__dirname, rel);

describe('Visual regression', () => {
  let browser, page, server;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    server = helpers.makeServer();
    server.listen(8080);
  });

  beforeEach(async () => {
    page = await browser.newPage();
    jasmine.addMatchers(helpers.matchers);
  })

  const tests = ['defaults', 'distant', 'minty', 'seed'];

  tests.forEach(test =>
    it(`should match "${test}" fixture`, async () => {
      await page.goto(`http://localhost:8080/${test}`);
      const shot = await page.screenshot({ type: 'png' });
      expect(shot).toMatchImage(absPath(`fixtures/${test}.png`));
    })
  );

  afterAll(async () => {
    await browser.close();
    server.close();
  });
});
