const request = require('request');

const mapboxDomain = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const mapboxToken = 'pk.eyJ1IjoicGVwZWhpcG9saXRvIiwiYSI6ImNqdXNpMjViazFreG40NHFwZTA3ZWRtYmgifQ.46Bg005-V8SBlpkrtwAiBw';

const getCoordinates = (location, callback) => {
  if (!location) {
    callback('Address not found.');
  } else {
    const mapboxUrl = `${mapboxDomain}${encodeURIComponent(location)}.json?access_token=${mapboxToken}&limit=1`;

    request({url: mapboxUrl, json: true}, (error, response) => {
      if (error) {
        callback('Unable to connect to Mapbox.');
      } else if (response.body.features.length === 0) {
        callback('Address not found.');
      } else {
        const features = response.body.features[0];
        const { place_name: placeName } = features;
        const [ longitude, latitude ] = features.center;
        callback(undefined, { latitude, longitude, placeName });
      }
    });
  }
};

module.exports = getCoordinates;
