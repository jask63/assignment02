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
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { addItem } = require('./store-service');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: 'djgzttgpx',
  api_key: '212511628475147',
  api_secret: 'r916jFvUB8ERg92Lvad9A3fHHr0',
  secure: true
});



//This is a upload variable without any disk storage
const upload = multer(); 

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.post('/items/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );

              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };

      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
      }

      upload(req).then((uploaded) => {
          processItem(uploaded.url);
          res.redirect('/items');
      });
  } else {
      processItem("");
      res.redirect('/items');
  }
});

function processItem(imageUrl) {
  const newItem = {
    imageUrl: imageUrl,
    // Add other properties as needed
  };

  addItem(newItem)
    .then((addedItem) => {
      console.log('Item added successfully:', addedItem);
      // Redirect to /items or do other necessary actions
    })
    .catch((error) => {
      console.error('Error adding item:', error);
      // Handle the error appropriately
    });
  }

app.get('/items/add', (req, res) => {
  res.sendFile(__dirname + '/views/addItem.html');
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
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    storeService.getItemsByCategory(category)
      .then((items) => res.json(items))
      .catch((error) => res.status(404).json({ error }));
  } else if (minDate) {
    storeService.getItemsByMinDate(minDate)
      .then((items) => res.json(items))
      .catch((error) => res.status(404).json({ error }));
  } else {
    storeService.getAllItems()
      .then((items) => res.json(items))
      .catch((error) => res.status(500).json({ error }));
  }
});

app.get('/item/:id', (req, res) => {
  const itemId = parseInt(req.params.id);

  storeService.getItemById(itemId)
    .then((item) => res.json(item))
    .catch((error) => res.status(404).json({ error }));
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
