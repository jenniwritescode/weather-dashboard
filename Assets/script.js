//current day using moment.js
//const today = moment().format('dddd, MMMM Do');
   // $('.todayDate').prepend(today);

//openweather api
async function getWeather(city) {
    let apiKey = "52b32e918d6b69c2aa0ccaa39544d317";
    const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial");
    const weatherObj = await response.json();
    localStorage.setItem(city, JSON.stringify(weatherObj));
    displayWeather(weatherObj);
}

function displayWeather(weatherObj) {
    
}

document.getElementById("searchBtn").addEventListener("click", function (event) {
    event.preventDefault();
    let input = document.getElementById("cityName");
    if (cityName === '') {
        alert("Please enter a city name. Click OK to try again.");
        return;
    }
    localStorage.setItem("City Name", input.value);
    var city = input.value;
    getWeather(city);
})
