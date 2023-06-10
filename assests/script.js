const APIKey = '0cebb1d0f1f0cc5e9d366bb00864e2cd';
const inputEl = document.getElementById("inputCity");
const searchEl = document.getElementById("search-button");
const nameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");
const currentTempEl = document.getElementById("temp");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const historyEl = document.getElementById("history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function initpage() {
    function getWeather(cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

    axios.get(queryURL)
        .then(function (response) {
        const { data } = response;
        const currentDate = new Date(data.dt * 1000);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        nameEl.innerHTML = `${data.name} (${month}/${day}/${year})`;
        currentPicEl.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        currentPicEl.setAttribute("alt", data.weather[0].description);
        currentTempEl.innerHTML = `Temperature: ${k2f(data.main.temp)} &#176F`;
        currentHumidityEl.innerHTML = `Humidity: ${data.main.humidity}%`;
        currentWindEl.innerHTML = `Wind Speed: ${data.wind.speed} mph`;

        const cityID = data.id;
        const forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIKey}`;

        axios.get(forecastQueryURL)
            .then(function (response) {
            const forecastEls = document.querySelectorAll(".forecast");
            forecastEls.forEach((forecastEl, i) => {
                forecastEl.innerHTML = "";
                const forecastIndex = i * 8 + 4;
                const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();

                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = `${forecastMonth}/${forecastDay}/${forecastYear}`;
                forecastEl.append(forecastDateEl);

                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.list[forecastIndex].weather[0].icon}@2x.png`);
                forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                forecastEl.append(forecastWeatherEl);

                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = `Temp: ${k2f(response.data.list[forecastIndex].main.temp)} &#176F`;
                forecastEl.append(forecastTempEl);

                const forecastWindEl = document.createElement("p");
                forecastWindEl.innerHTML = `Wind: ${response.data.list[forecastIndex].wind.speed} MPH`;
                forecastEl.append(forecastWindEl);

                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = `Humidity: ${response.data.list[forecastIndex].main.humidity}%`;
                forecastEl.append(forecastHumidityEl);
            });
            });
        });
    }

    searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
    });

    function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
    historyEl.innerHTML = "";
    searchHistory.forEach((searchTerm) => {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("style", "margin-bottom: 10px;");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-grey");
        historyItem.setAttribute("value", searchTerm);
        historyItem.addEventListener("click", function () {
        getWeather(searchTerm);
        });
        historyEl.append(historyItem);
    });
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
    }
}

initpage();