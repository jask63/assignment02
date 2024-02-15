const fs = require('fs');

let items = [];
let categories = [];

const readJSONFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(`Unable to read file: ${filename}`);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(`Error parsing ${filename}: ${parseError.message}`);
      }
    });
  });
};

const initialize = () => {
  return new Promise((resolve, reject) => {
    readJSONFile('data/item.json')
      .then((itemsData) => {
        items = itemsData;

        readJSONFile('data/categories.json')
          .then((categoriesData) => {
            categories = categoriesData;
            resolve('Initialization successful');
          })
          .catch((categoriesError) => {
            reject(categoriesError);
          });
      })
      .catch((itemsError) => {
        reject(itemsError);
      });
  });
};

const getAllItems = () => {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject('No results returned');
    } else {
      resolve(items);
    }
  });
};

const getPublishedItems = () => {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter((item) => item.published === true);
    if (publishedItems.length === 0) {
      reject('No results returned');
    } else {
      resolve(publishedItems);
    }
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No results returned');
    } else {
      resolve(categories);
    }
  });
};
const addItem = (newItem) => {
  return new Promise((resolve, reject) => {
    if (newItem.published === undefined) {
      newItem.published = false;
    } else {
      newItem.published = true;
    }

    newItem.id = items.length + 1;
    items.push(newItem);

    resolve(newItem);
  });
};

const getItemsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter(item => item.category === category);
    if (filteredItems.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredItems);
    }
  });
};

const getItemsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter(item => new Date(item.postDate) >= new Date(minDateStr));
    if (filteredItems.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredItems);
    }
  });
};

const getItemById = (id) => {
  return new Promise((resolve, reject) => {
    const foundItem = items.find(item => item.id === id);
    if (foundItem) {
      resolve(foundItem);
    } else {
      reject('No result returned');
    }
  });
};

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
};