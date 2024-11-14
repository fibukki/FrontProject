const apiKey = "924c7f14063e80b78d732ee729a98462";
// const apiKey="934bba235903fa32d3181dc1ce9f6d03";
let isCelsius = true;
let data;

const weatherLocationInput = document.getElementById("weatherLocation");
const dropdown = document.getElementById("dropdown");
const resultlist = document.getElementById("resultlist");

function search() {
  let content = document.getElementById("weatherLocation");
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${content.value}&units=metric&APPID=${apiKey}`)
    .then(response => response.json())
    .then(responseJson => {
      updateView(responseJson);
      content.value = "";
    });
}

function searchForecast() {
  let content = document.getElementById("weatherLocation");
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${content.value}&units=metric&APPID=${apiKey}`)
    .then(currentResponse => currentResponse.json())
    .then(currentResponseJson => {
      updateForecast(currentResponseJson);
      content.value = "";
      data = currentResponseJson;
    });
}

function currentLoc() {
  navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=${apiKey}`)
      .then(currentResponse => currentResponse.json())
      .then(currentResponseJson => {
        updateView(currentResponseJson);
      });
  });
}

function forecastLoc() {
  navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=${apiKey}`)
      .then(currentResponse => currentResponse.json())
      .then(currentResponseJson => {
        updateForecast(currentResponseJson);
      });
  });
}

currentLoc();
forecastLoc();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekDaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function updateView(responseJson) {
  const curLocation = responseJson.name;
  const curCountry = responseJson.sys.country;
  const weatherName = responseJson.weather[0].description;
  const dateObj = new Date(responseJson.dt * 1000);
  const date = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const weekDayf = weekDaysFull[dateObj.getDay()];
  const localTime = `${date} ${month} ${year}`;
  const sunrise = new Date(responseJson.sys.sunrise * 1000);
  const sunset = new Date(responseJson.sys.sunset * 1000);
  const icon = responseJson.weather[0].icon;

  document.querySelector("#dayname").textContent = weekDayf;
  document.querySelector(".date-day").textContent = localTime;
  document.querySelector(".location").textContent = `${curLocation}, ${curCountry}`;
  document.querySelector(".weather-temp").textContent = `${Math.round(responseJson.main.temp)}°C`;
  document.querySelector(".weather-desc").textContent = weatherName;
  document.querySelector(".sunrise").textContent = `Sunrise: ${sunrise.getHours()}:${sunrise.getMinutes()}`;
  document.querySelector(".sunset").textContent = `Sunset: ${sunset.getHours()}:${sunset.getMinutes()}`;
  document.querySelector(".weather-icon").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  document.querySelector("#WIND").textContent = `${responseJson.wind.speed} m/s`;
  document.querySelector("#HUMIDITY").textContent = `${responseJson.main.humidity}%`;
  document.querySelector("#PRESSURE").textContent = `${responseJson.main.pressure} hPa`;

  if (responseJson.weather[0].main === "Clouds" && responseJson.clouds.all !== "undefined") {
    document.querySelector(".clouds").innerHTML = `<span class="title">CLOUDS</span><span class="value" id="CLOUDS">${responseJson.clouds.all}%</span><div class="clear"></div>`;
  }
  if (responseJson.weather[0].main === "Rain" && responseJson.rain !== "undefined") {
    document.querySelector(".precipitation").innerHTML = `<span class="title">PRECIPITATION</span><span class="value" id="PRECIPITATION">${responseJson.rain} mm/h.</span><div class="clear"></div>`;
  }
  if (responseJson.weather[0].main === "Snow" && responseJson.snow !== "undefined") {
    document.querySelector(".precipitation").innerHTML = `<span class="title">PRECIPITATION</span><span class="value" id="PRECIPITATION">${responseJson.snow} mm/h.</span><div class="clear"></div>`;
  }
}

function updateForecast(data) {
  const weekList = document.getElementById("week-list");
  weekList.innerHTML = "";

  const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));
  dailyForecasts.slice(0, 5).forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.weather[0].icon;
    const tempHigh = Math.round(day.main.temp_max);
    const tempLow = Math.round(day.main.temp_min);

    const forecastItem = document.createElement("li");
    forecastItem.innerHTML = `
      <img class="day-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${day.weather[0].main} icon">
      <span class="day-name">${dayName}</span>
      <span class="day-temp">H: ${tempHigh}°C</span>
      <span class="day-temp">L: ${tempLow}°C</span>
    `;
    weekList.appendChild(forecastItem);
  });
}

function fetchCitySuggestions(query) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`)
    .then(response => response.json())
    .then(cities => {
      showSuggestions(cities);
    })
    .catch(error => console.error("Error fetching city suggestions:", error));
}

function showSuggestions(cities) {
  resultlist.innerHTML = "";
  dropdown.style.display = cities.length > 0 ? "block" : "none";
  cities.forEach(city => {
    const listItem = document.createElement("li");
    listItem.textContent = `${city.name}, ${city.country}`;
    listItem.addEventListener("click", () => selectCity(city.name));
    resultlist.appendChild(listItem);
  });
}

function selectCity(cityName) {
  weatherLocationInput.value = cityName;
  dropdown.style.display = "none";
  search();
  searchForecast();
}
weatherLocationInput.addEventListener("input", () => {
  const query = weatherLocationInput.value.trim();
  if (query.length > 1) {
    fetchCitySuggestions(query);
  } else {
    dropdown.style.display = "none";
  }
});

document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target) && event.target !== weatherLocationInput) {
    dropdown.style.display = "none";
  }
});

document.getElementById("changeTempBtn").addEventListener("click", toggleTemperatureUnit);

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  const tempElement = document.querySelector(".weather-temp");
  const currentTemp = parseFloat(tempElement.textContent);

  if (isCelsius) {
    const celsiusTemp = (currentTemp - 32) * (5 / 9);
    tempElement.textContent = `${Math.round(celsiusTemp)}°C`;
  } else {
    const fahrenheitTemp = currentTemp * (9 / 5) + 32;
    tempElement.textContent = `${Math.round(fahrenheitTemp)}°F`;
  }
  updateForecastTemperatures();
}

function updateForecastTemperatures() {
  const forecastItems = document.querySelectorAll("#week-list .day-temp");
  forecastItems.forEach(item => {
    const tempValue = parseFloat(item.textContent.match(/-?\d+/));

    if (isCelsius) {
      const celsiusTemp = (tempValue - 32) * (5 / 9);
      item.textContent = `H: ${Math.round(celsiusTemp)}°C`;
    } else {
      const fahrenheitTemp = tempValue * (9 / 5) + 32;
      item.textContent = `H: ${Math.round(fahrenheitTemp)}°F`;
    }
  });
}

document.getElementById("search").addEventListener("click", () => {
  search();
  searchForecast();
});
document.addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    search();
    searchForecast();
  }
});

document.getElementById("changeLocationBtn").addEventListener("click", () => {
  const locationSearch = document.getElementById("locationSearch");
  locationSearch.style.display = locationSearch.style.display === "none" ? "flex" : "none";
});
