const path = require('path');
const express = require('express');
const hbs = require('hbs'); // This is necessary to make the partials work but not the view engine!!!

const getCoordinates = require('./mapbox/index');
const getWeather = require('./darksky/index');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config.
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views location:
// This sets 'handlebars' as the view templating system. 'hbs' is an npm module that needs to be
// installed as a dependency. For this to work 'hbs' does not need to be required in the page.
app.set('view engine', 'hbs');

// This sets the view templates path for 'handlebars'. If this is not specified the default is set
// to be the 'views' folder from the root of the app (web-server/templates).
app.set('views', viewsPath);

// This sets the view partials path for 'handlebars'.
hbs.registerPartials(partialsPath);


// Setup static directory to serve:
// This will serve the page at public/index.html. We don't need the file name because by default
// 'index.html' is served if no path is provided in the URL.
app.use(express.static(publicDirectoryPath));


// Routes:
// We need routes for handlebar templates, since they don't live in the 'public' folder.
app.get('', (req, res) => {
  // 'render()' will render a handlebars view from the views folder.
  // The first argument is the name of the template. It does not need the file extension.
  // The second argument is an object with the values to be passed to the template.
  res.render('index', {
    name: 'Pepe Hipolito',
    title: 'Weather'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    name: 'Pepe Hipolito',
    title: 'About Me'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'This is my helpful message.',
    name: 'Pepe Hipolito',
    title: 'Help'
  });
});

// Routes receive requests and process them.

// No longer needed as it's served by the static setup in 'app.use(...)' line above.
// app.get('', (req, res) => {
//   res.send('<h1>Hello express!</h1>');
// });

// No longer needed as it's served by the static setup in 'app.use(...)' line above.
// app.get('/help', (req, res) => {
//   res.send([
//     {
//       name: 'pepe',
//       age: 53
//     },
//     {
//       name: 'tzutai',
//       age: 45
//     }
//   ]);
// });

// No longer needed as it's served by the static setup in 'app.use(...)' line above.
// app.get('/about', (req, res) => {
//   res.send('<html><head><title>My title</title></head></html>');
// });

app.get('/weather', (req, res) => {
  const { address } = req.query;

  if (!address) return res.send({error: 'Please enter an address'});

  getCoordinates(address, (error, data = {}) => {
    if (error) return res.send({ error });

    getWeather(data, (error, response) => {
      if (error) return res.send({ error });

      const { placeName } = data;
      const { precipProbability, temperature, temperatureHigh, temperatureLow, summary } = response;

      res.send({
        address,
        location: placeName,
        forecast: `${summary} It is currently ${temperature} degrees out and there is a ${precipProbability}% chance of rain in ${placeName}. The low for the day is expected to be ${temperatureLow} and the maximum for the day is expected to be ${temperatureHigh}.`
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    });
  }

  const products = {
    games: ['foo', 'bar'],
    books: ['a', 'b', 'c']
  }
  console.log('query:', req.query.search)
  res.send({
    products: products[req.query.search] || []
  });
});

// 404 page for the help page
app.get('/help/*', (req, res) => {
  res.render('404', {
    message: 'Help article not found.',
    name: 'Pepe Hipolito',
    title: '404 - Not Found'
  });
});

// Generic 404 page
app.get('*', (req, res) => {
  res.render('404', {
    message: 'Page not found.',
    name: 'Pepe Hipolito',
    title: '404 - Not Found'
  });
});

// The server does not start until it is told to listen for requests.
// In order to start the server we need to start it from the command line: node <path>/app.js.
// But in order to see changes we would need to restart the server from the command line every time.
// A better approach is to use nodemon: nodemon <path>/app.js
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
