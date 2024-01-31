const express = require('express');
const storeService = require('./store-service');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

app.get('/shop', (req, res) => {
  storeService.getPublishedItems()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
});

app.get('/items', (req, res) => {
  storeService.getAllItems()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
});

app.get('/categories', (req, res) => {
  storeService.getCategories()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Page Not Found' });
});

storeService.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
