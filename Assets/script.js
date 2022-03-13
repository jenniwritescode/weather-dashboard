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
  console.log(current);
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
  var forecastObj = new Array();
  for (i = 0; i < 5; i++) {
    forecastObj[i] = _.values(forecast);
  }
  currentWeather(city, currentObj);
  forecastWeather(forecastObj);
  searchHistory(city);
}

// create a button for each city searched
function searchHistory(city) {
  let displayEl = document.getElementById("history");
  let cityButton = document.createElement("button");
  displayEl.appendChild(cityButton);
  cityButton.className = "searchbtn btn btn-light btn-block";
  cityButton.id = "historySearch";
  cityButton.textContent = city;
  localStorage.setItem("searchHistory", city);
}

function currentWeather(city, data) {
  //create card
  let displayEl = document.getElementById("current");
  //clear existing html
  let title = document.getElementById("currTitle");
  if (title != null) {
    console.log(title);
    title.innerHTML = "";
  }
  displayEl.innerHTML = "";
  let cardEl = document.createElement("div");
  let count = 0;
  cardEl.className = "card bg-light mb-3";
  displayEl.appendChild(cardEl);

  //create title div
  let cardTitleEl = document.createElement("div");
  cardTitleEl.className = "card-header";
  cardEl.appendChild(cardTitleEl);
  const today = new Date(data.dt * 1000);
  cardTitleEl.textContent =
    "Current weather in " +
    city +
    " on " +
    today.toLocaleDateString("en-US") +
    " at " +
    today.toLocaleTimeString("en-us");

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

  //uv index
  pEl = document.createElement("p");
  cardEl.appendChild(pEl);
  pEl.className = "card-text";
  if (data.uvi < 3) {
    pEl.setAttribute("style", "background-color:#228B22", "text-color:#ffffff");
    pEl.textContent = "UV Index: " + data.uvi;
  } else if (data.uvi < 6 && data.uvi > 2) {
    pEl.setAttribute("style", "background-color:#FFA500", "text-color:#ffffff");
    pEl.textContent = "UV Index: " + data.uvi;
  } else {
    pEl.setAttribute("style", "background-color:#FF0000", "text-color:#ffffff");
    pEl.textContent = "UV Index: " + data.uvi;
  }
}

function forecastWeather(data) {
  let count = 0;
  let displayEl = document.getElementById("forecast");
  //clear existing html
  let title = document.getElementById("foreTitle");
  if (title != null) {
    console.log(title);
    title.innerHTML = "";
  }
  displayEl.innerHTML = "";

  //create title
  let titleEl = document.createElement("h4");
  displayEl.appendChild(titleEl);
  titleEl.textContent = "5-Day Weather Forecast";

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

function searchAgain(event) {
  event.preventDefault();
  //console.log("clearing html");
  //clearWeather();
  let current = $(event.target).text();
  getWeather(current);
}

// clear innerHTML of current and forecast divs
// function clearWeather() {

//     }

// submit button event listener
document
  .getElementById("submitBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    getInput(event);
  });

// get input from the user to search
function getInput(event) {
  event.preventDefault();
  const input = document.getElementById("cityName");
  if (input.value === "") {
    console.log("no data");
    alert("Please enter a city name. Click OK to try again.");
    return false;
  } else {
    localStorage.setItem("City Name", input.value);
    var city = input.value;
    getWeather(city);
  }
}

// search history button event listener
document.getElementById("history").addEventListener("click", function (event) {
  let target = event.target;
  if (target.className.includes("searchbtn")) {
    searchAgain(event);
  } else {
    getInput(event);
  }
});
