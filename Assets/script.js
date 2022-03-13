//openweather api
async function getWeather(city) {
  let apiKey = "52b32e918d6b69c2aa0ccaa39544d317";

  //get coordinates for city
  const coords = await fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      apiKey
  );
  const coordsObj = await coords.json();
  var lat = coordsObj[0].lat;
  var lon = coordsObj[0].lon;

  //api call for current weather
  const weather = await fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=hourly,minutely,alerts&units=imperial" +
      "&appid=" +
      apiKey
  );
  //check for response
  if (200 !== weather.status) {
    console.log(
      "Looks like there was a problem. Status Code: " + weather.status
    );
    return;
  }
  const weatherObj = await weather.json();

  //store weather information in local storage and parse out the data we want to use
  let current = weatherObj.current;
  var currentObj = _.pick(
    current,
    "dt",
    "humidity",
    "temp",
    "weather",
    "wind_speed"
  );

  // reduce forecast to just 5 days
  let forecast = weatherObj.daily;
  var forecastObj = new Array();
  for (i = 0; i < 5; i++) {
    forecastObj[i] = _.values(forecast);
  }
  console.log(forecastObj);

  localStorage.setItem(city, JSON.stringify(weatherObj.current));
  localStorage.setItem("forecast", JSON.stringify(weatherObj.daily));
  currentWeather(city, currentObj);
  forecastWeather(forecastObj);
  searchHistory(city);
}

function searchHistory(city) {
  let displayEl = document.getElementById("history");
  let cityButton = document.createElement("button");
  displayEl.appendChild(cityButton);
  cityButton.className = "btn btn-light btn-block";
  cityButton.textContent = city;
}

function currentWeather(city, data) {
  //create card
  let displayEl = document.getElementById("current");
  let cardEl = document.createElement("div");
  let count = 0;
  cardEl.className = "card bg-light mb-3";
  displayEl.appendChild(cardEl);

  //create title div
  let cardTitleEl = document.createElement("div");
  cardTitleEl.className = "card-header";
  cardEl.appendChild(cardTitleEl);
  const today = new Date(data.dt * 1000);
  cardTitleEl.textContent = city + " on " + today.toLocaleDateString("en-US") + " at " + today.toLocaleTimeString("en-us");

  //create img div
  divEl = document.createElement("div");
  divEl.className = "card-image";
  cardEl.appendChild(divEl);

  // image/icon
  var iconcode = data.weather[count].icon;
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  let imgEl = document.createElement("img");
  imgEl.setAttribute("src", iconurl);
  divEl.appendChild(imgEl);

  //create content div
  divEl = document.createElement("div");
  cardEl.appendChild(divEl);
  divEl.className = "card-text";

  //temperature
  let pEl = document.createElement("p");
  cardEl.appendChild(pEl);
  pEl.className = "card-text";
  pEl.textContent = "Temp: " + data.temp + "°F";

  //humidity
  pEl = document.createElement("p");
  cardEl.appendChild(pEl);
  pEl.className = "card-text";
  pEl.textContent = "Humidity: " + data.humidity + "%";

  //wind speed
  pEl = document.createElement("p");
  cardEl.appendChild(pEl);
  pEl.className = "card-text";
  pEl.textContent = "Wind: " + data.wind_speed + " mph";
}

function forecastWeather(data) {
  console.log("displaying forecasted weather");
  let count = 0;
  let displayEl = document.getElementById("forecast");

  //create row for cards
  // let rowEl = document.createElement("div");
  // displayEl.appendChild(rowEl);
  // rowEl.className = "row";

  for (i = 0; i < 5; i++) {
    //create daily forecast card
    let cardEl = document.createElement("div");
    cardEl.className = "card bg-light mb-3";
    cardEl.id = `card-${i}`;
    displayEl.appendChild(cardEl);

    //create title div
    let cardTitleEl = document.createElement("h5");
    cardTitleEl.className = "card-header";
    cardEl.appendChild(cardTitleEl);
    const date = new Date(data[count][i].dt * 1000);
    cardTitleEl.textContent = date.toLocaleDateString("en-US");

    //create img div
    divEl = document.createElement("div");
    divEl.className = "card-image";
    cardEl.appendChild(divEl);

    // image/icon
    var iconcode = data[count][i].weather[count].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    let imgEl = document.createElement("img");
    imgEl.setAttribute("src", iconurl);
    divEl.appendChild(imgEl);

    //create content div
    divEl = document.createElement("div");
    cardEl.appendChild(divEl);
    divEl.className = "card-text";

    //temperature
    let pEl = document.createElement("p");
    cardEl.appendChild(pEl);
    pEl.className = "card-text";
    pEl.textContent = "Temp: " + data[count][i].temp.day + "°F";

    //humidity
    pEl = document.createElement("p");
    cardEl.appendChild(pEl);
    pEl.className = "card-text";
    pEl.textContent = "Humidity: " + data[count][i].humidity + "%";

    //wind speed
    pEl = document.createElement("p");
    cardEl.appendChild(pEl);
    pEl.className = "card-text";
    pEl.textContent = "Wind: " + data[count][i].wind_speed + " mph";
  }
}

document
  .getElementById("submitBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const input = document.getElementById("cityName");
    console.log(input.value);
    if (input.value === "") {
      console.log("no data");
      alert("Please enter a city name. Click OK to try again.");
      return false;
    } else {
      localStorage.setItem("City Name", input.value);
      var city = input.value;
      getWeather(city);
    }
  });
