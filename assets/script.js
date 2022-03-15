// container to store search history
var searchHistory = [];

// variables for html elements
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#city-search-history");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#forecast-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// get input from the user to search
function getInput(event) {
  event.preventDefault();
  let city = cityInputEl.value.trim();
  // check for valid input
  if (city === "") {
    console.log("no data");
    alert("Please enter a city name. Click OK to try again.");
    return false;
  } else {
    getWeather(city);
    // add city to search history array and make it the most recent entry
    searchHistory.unshift(city);
    cityInputEl.value = "";
  }
  saveSearch();
  // pastSearch(city);
}

// function to save search history
function saveSearch() {
  localStorage.setItem("cities", JSON.stringify(searchHistory));
}

//openweather api function
//openweather api function
async function getWeather(city) {
  let apiKey = "52b32e918d6b69c2aa0ccaa39544d317";

  //get coordinates for city
  const coords = await fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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
  console.log("search done");

  // separate results into current and forecast weather
  let current = weatherObj.current;
  var currentObj = _.pick(
    current,
    "dt",
    "humidity",
    "uvi",
    "temp",
    "weather",
    "wind_speed"
  );

  // reduce forecast to just 5 days
  let forecast = weatherObj.daily;
  var forecastObj = [];
  for (i = 0; i < 5; i++) {
    forecastObj[i] = _.values(forecast);
  }
  console.log(forecastObj);
  showCurrentWeather(currentObj, city);
  showForecastWeather(forecastObj, city);
   // searchHistory(city);
}

// create a button for each city searched
// function searchHistory(city) {
//   let displayEl = document.getElementById("history");
//   let cityButton = document.createElement("button");
//   displayEl.appendChild(cityButton);
//   cityButton.className = "searchbtn btn btn-light btn-block";
//   cityButton.id = "historySearch";
//   cityButton.textContent = city;
//   localStorage.setItem("searchHistory", city);
// }

function showCurrentWeather(currentObj, searchCity) {
  //clear existing html
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;

  //today's date
  var currentDate = document.createElement("span");
  const today = new Date(currentObj.dt * 1000);
  currentDate.textContent = " " + today.toLocaleDateString("en-US");
  //  today.toLocaleTimeString("en-us");
  citySearchInputEl.appendChild(currentDate);

  //create img element using weather icon from api
  var weatherIcon = document.createElement("img")
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${currentObj.weather[0].icon}@2x.png`);
  citySearchInputEl.appendChild(weatherIcon);

  //temperature
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + currentObj.temp + " °F";
  temperatureEl.classList = "list-group-item"
  weatherContainerEl.appendChild(temperatureEl);

  //humidity
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + currentObj.humidity + " %";
  humidityEl.classList = "list-group-item"
  weatherContainerEl.appendChild(humidityEl);

  //wind speed
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + currentObj.wind_speed + " mph";
  windSpeedEl.classList = "list-group-item"
  weatherContainerEl.appendChild(windSpeedEl);

  //uv index
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: "
  uvIndexEl.classList = "list-group-item"

  uvIndexValue = document.createElement("span")
  uvIndexValue.textContent = currentObj.uvi;

  if (currentObj.uvi <= 2) {
    uvIndexValue.classList = "favorable"
  } else if (currentObj.uvi > 2 && currentObj.uvi <= 8) {
    uvIndexValue.classList = "moderate "
  }
  else if (currentObj.uvi > 8) {
    uvIndexValue.classList = "severe"
  };

  uvIndexEl.appendChild(uvIndexValue);
  weatherContainerEl.appendChild(uvIndexEl);
}

function showForecastWeather(forecastObj, searchCity) {
  //clear existing html
  forecastContainerEl.textContent = "";
  let objCount = 0;

  for (i = 0; i < forecastObj.length; i++) {
    //create daily forecast card
    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    //create date element
    var forecastDate = document.createElement("h5")
    const fDate = new Date(forecastObj[objCount][i].dt * 1000);
    forecastDate.textContent = fDate.toLocaleDateString("en-US");
    forecastDate.classList = "card-header text-center"
    forecastEl.appendChild(forecastDate);

    //create img element using weather icon from API
    var weatherIcon = document.createElement("img")
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${forecastObj[objCount][i].weather[0].icon}@2x.png`);
    forecastEl.appendChild(weatherIcon);

    //temperature
    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = forecastObj[objCount][i].temp.day + " °F";
    forecastEl.appendChild(forecastTempEl);

    //humidity
    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = forecastObj[objCount][i].humidity + "  %";
    forecastEl.appendChild(forecastHumEl);

    //append to 5-day container
    forecastContainerEl.appendChild(forecastEl);
  }
}

// event handler
cityFormEl.addEventListener("submit", getInput);

// function searchAgain(event) {
//   event.preventDefault();
//   //console.log("clearing html");
//   //clearWeather();
//   let current = $(event.target).text();
//   getWeather(current);
// }

// search history button event listener
// document.getElementById("history").addEventListener("click", function (event) {
//   let target = event.target;
//   if (target.className.includes("searchbtn")) {
//     console.log("function: searchAgain");
//     searchAgain(event);
//   } else {
//     getInput(event);
//   }
// });