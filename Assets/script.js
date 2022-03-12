//current day using moment.js
//const today = moment().format('dddd, MMMM Do');
// $('.todayDate').prepend(today);

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

  //store current weather information in local storage
  localStorage.setItem(city, JSON.stringify(weatherObj));
  displayWeather(weatherObj);
}

function displayWeather(weatherObj) {
  let currWeather = weatherObj.current;
  let forecastWeather = weatherObj.daily;
  //console.log("Current Temp: " + currWeather.temp);
  //console.log("The temp tomorrow will be: " + forecastWeather[1].temp.day);
  forecastDisplay(forecastWeather);
}

function forecastDisplay (forecastWeather) {
    let displayEl = document.getElementById("forecast");
    let index = 0;
    let cardEl='';
    forecastWeather.forEach((daily) => {
      // create card
      console.log("creating cards");
      cardEl = document.createElement("div");
      cardEl.className = "forecast-card";
      cardEl.id = `card-${index}`;
      displayEl.appendChild(cardEl);
      index++;
    });

    let divEl = document.createElement("div");
    divEl.className = "card-image";
    cardEl.appendChild(divEl);

    //let imgEl = document.createElement("img");
    //imgEl.setAttribute("");
    //divEl.appendChild(imgEl);

    // create div for content
    divEl = document.createElement("div");
    cardEl.appendChild(divEl);
    divEl.className = "card-content";

    // event name
    let spanEl = document.createElement("span");
    spanEl.className = "card-title";
    const unixTime = forecastWeather.current.dt;
    const cardDate =  new Date(unixTime*1000);
    spanEl.textContent = cardDate.toLocaleDateString("en-US");
    divEl.appendChild(spanEl);
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
