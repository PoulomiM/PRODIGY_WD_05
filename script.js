const apiKey = "e63d0e90e4ae6e4778c8b771db405413";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?&q=";
const LocUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const forecasturl = "https://api.openweathermap.org/data/2.5/forecast?";

const searchButton = document.querySelector(".Search_btn");
const searchInput = document.querySelector(".search-input");
const weatherIcon = document.querySelector(".icon img");

async function checkWeather(city) {
  try {
    const currentWeatherResponse = await fetch(currentWeatherUrl + city + `&appid=${apiKey}`);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();

    console.log(currentWeatherData);
    console.log(forecastData);

    document.querySelector(".city").innerHTML = currentWeatherData.name;
    document.querySelector(".temp").innerHTML = "Temperature: " + Math.round(currentWeatherData.main.temp) + "°C";
    document.querySelector(".wind").innerHTML = "Humidity: " + currentWeatherData.main.humidity + "%";
    document.querySelector(".humidity").innerHTML = "Wind: " + currentWeatherData.wind.speed + "m/s";

    updateWeatherIcon(currentWeatherData.weather[0].main);
    updateForecast(forecastData);

  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

async function checkWeatherLoc(latitude, longitude) {
  try {
    const currentLocationResponse = await fetch(`${LocUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const currentLocationData = await currentLocationResponse.json();

    console.log(currentLocationData);
    document.querySelector(".city").innerHTML = currentLocationData.name;
    document.querySelector(".temp").innerHTML = "Temperature: " + Math.round(currentLocationData.main.temp) + "°C";
    document.querySelector(".wind").innerHTML = "Humidity: " + currentLocationData.main.humidity + "%";
    document.querySelector(".humidity").innerHTML = "Wind: " + currentLocationData.wind.speed + "m/s";

    updateWeatherIcon(currentLocationData.weather[0].main);

    const LocforecastResponse = await fetch(`${forecasturl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const forecastData = await LocforecastResponse.json();

    updateForecast(forecastData);
    
  } catch (error) {
    console.error('Error fetching current location weather data:', error);
  }
}

function updateWeatherIcon(weatherCondition) {
  if (weatherCondition === "Haze") {
    weatherIcon.setAttribute("src", "haze.png");
  } else if (weatherCondition === "Clouds") {
    weatherIcon.setAttribute("src", "cloudy.png");
  } else if (weatherCondition === "Clear") {
    weatherIcon.setAttribute("src", "sun.png");
  } else if (weatherCondition === "Rain") {
    weatherIcon.setAttribute("src", "rain.png");
  } else if (weatherCondition === "Drizzle") {
    weatherIcon.setAttribute("src", "rainshower.png");
  } else if (weatherCondition === "Snow") {
    weatherIcon.setAttribute("src", "snow.png");
  } else if (weatherCondition === "Thunderstorm") {
    weatherIcon.setAttribute("src", "storm.png");
  } else if (weatherCondition === "Mist") {
    weatherIcon.setAttribute("src", "mist.png");
  } else if (weatherCondition === "Fog") {
    weatherIcon.setAttribute("src", "fog.png");
  } else if (weatherCondition === "Smoke") {
    weatherIcon.setAttribute("src", "smoke.png");
  } else {
    weatherIcon.setAttribute("src", "default.png");
  }
}

function updateForecast(forecastData) {
  console.log(forecastData);
  const forecastCards = document.querySelector(".weather-cards");

  forecastCards.innerHTML = "";

  const uniqueForecastDay = [];
  const fiveDaysForecast = forecastData.list.filter(forecast => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDay.includes(forecastDate)) {
      uniqueForecastDay.push(forecastDate);
      return true;
    }
    return false;
  });

  fiveDaysForecast.forEach(dayForecast => {
    const forecastCard = document.createElement("li");
    forecastCard.classList.add("card");
    forecastCard.innerHTML = `
      <h3>${dayForecast.dt_txt.split(" ")[0]}</h3>
      <img src="https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@4x.png" alt="weather-icon">
      <h6>Temp: ${Math.round(dayForecast.main.temp- 273.15).toFixed(2)}°C</h6>
      <h6>Wind: ${dayForecast.wind.speed} M/S</h6>
      <h6>Humidity: ${dayForecast.main.humidity}%</h6>
    `;
    forecastCards.appendChild(forecastCard);
  });
}

searchButton.addEventListener("click", () => {
  checkWeather(searchInput.value);
});

document.querySelector(".Loc_btn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      checkWeatherLoc(latitude, longitude);
    },
    error => {
      console.error("Error getting current location:", error);
    }
  );
});
