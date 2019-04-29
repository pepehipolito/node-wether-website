function getWeather(address) {
  fetch(`http://localhost:3000/weather?address=${encodeURIComponent(address)}`).then(response => {
    response.json().then(data => {
      if (data.error) {
        document.getElementById("error").innerHTML = data.error;
        document.getElementById("forecast").innerHTML = '';
        return;
      }

      document.getElementById("error").innerHTML = data.location;
      document.getElementById("forecast").innerHTML = data.forecast;
    });
  });
}

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = search.value;
  getWeather(location)
})
