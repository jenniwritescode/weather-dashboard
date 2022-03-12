//openweather api

function getWeather(city) {
    event.preventDefault();
    let apiKey = "52b32e918d6b69c2aa0ccaa39544d317";
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial", {
        "method": "GET"})
        .then(response => {
            const currWeather = localStorage.setItem(city, JSON.stringify(response));
            console.log(currWeather);
        })
        .catch(err => {
            alert("Weather not found.");
            console.error(err);
        });
    }

document.getElementById("searchBtn").addEventListener("click", function (event) {
    let input = document.getElementById("cityName");
    localStorage.setItem("City Name", input.value);
    var city = input.value;
    console.log(city);
    getWeather(city);
})
