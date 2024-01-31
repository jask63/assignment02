/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  
Academic Policy.  No part *  of this assignment has been copied manually 
or electronically from any other source (including 3rd party web sites)
 or distributed to other students.

Name: _Jasmeet Kaur_ 
Student ID: _146412226_ 
Date: _31/01/2024_
Cyclic Web App URL: _https://outrageous-blue-tick.cyclic.app/about_
GitHub Repository URL: _https://github.com/jask63/assignment02_

********************************************************************************/ 



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
