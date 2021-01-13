const express = require('express');
const fs = require('fs');
const http = require('http');
const PNG = require('pngjs').PNG;
const path = require('path');
const pixelmatch = require('pixelmatch');
const { renderFile } = require('pug');

const absPath = rel => path.join(__dirname, rel);

// Returns an Express server which hosts browser tests
exports.makeServer = () => {
  const app = express();
  const render = test => renderFile(absPath('./index.pug'), { test });
  app.use(express.static(absPath('../fixtures')));
  app.use(express.static(absPath('../../', { index: false })));
  app.get('/:test', (req, res) => res.send(render(req.params.test)));
  return http.createServer(app);
}

// Returns mismatch between two PNG image buffers or Uint8Arrays
exports.pngDiff = (buf1, buf2) => {
  const png1 = PNG.sync.read(buf1);
  const png2 = PNG.sync.read(buf2);
  const { width, height } = png1;
  const mismatch = pixelmatch(png1.data, png2.data, null, width, height);
  return mismatch / (width * height);
};

// Custom Jasmine matchers
exports.matchers = {};

// Jasmine matcher: expect image to match fixture
exports.matchers.toMatchImage = () => ({
  compare(actualImage, fixturePath) {
    const fixtureImage = fs.readFileSync(fixturePath);
    const diff = exports.pngDiff(actualImage, fixtureImage);

    const pass = diff === 0;
    let message = 'Expected image to match fixture';
    if (!pass) message += ` but ${Math.ceil(diff * 100)}% pixels differ`;
    return { pass, message };
  }
});
