const request = require('request');

const darkskyDomain = 'https://api.darksky.net/forecast/';
const darkskyKey = 'ebb7721f2ef8e12c0ebfffb2cc902558';
const units = 'us';
const language = 'en';

const getWeather = (data, callback) => {
  const { latitude, longitude } = data;
  const darkskyUrl = `${darkskyDomain}${darkskyKey}/${latitude},${longitude}?units=${units}&lang=${language}`;

  request({url: darkskyUrl, json: true}, (error, response) => {
    if (error) {
      callback('Unable to connect to DarkSky.');
    } else if (response.body.error) {
      callback(response.body.error);
    } else {
      const { temperature, precipProbability } = response.body.currently;
      const data = response.body.daily.data[0];
      const { summary, temperatureHigh, temperatureLow } = data;
      callback(undefined, { precipProbability, temperature, temperatureHigh, temperatureLow, summary });
    }
  });
};

module.exports = getWeather;
