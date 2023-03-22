function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  //work on time, it does not change
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  console.log(response.data);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row" id="weekdays-forecast">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
         <div class="col-2 weekday-blocks">
            <div class = "forecast-date">${formatDay(forecastDay.time)}</div>
            <img src = "http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              forecastDay.condition.icon
            }.png"
             alt=""
             width="60"
             />
            <div class="weather-temperatures">
                <span class="forecast-max">${Math.round(
                  forecastDay.temperature.maximum
                )}°</span>
                <span class="forecast-min">${Math.round(
                  forecastDay.temperature.minimum
                )}°</span>        
            </div>
         </div>
   `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "6ba36a1o3840c2e3de5bc4a87fd48c5t";
  let apiURL = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  console.log(apiURL);

  axios.get(apiURL).then(displayForecast);
}

function searchCity(event) {
  event.preventDefault();
  let h1 = document.querySelector("h1");
  let typeCity = document.querySelector("#search-city");
  h1.innerHTML = `${typeCity.value}`;
  searchCurrentCity(typeCity.value);
}

let submitForm = document.querySelector("#search-form");
submitForm.addEventListener("submit", searchCity);

let temp = document.querySelector(".temperature");

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temp.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

function showFahrenheitTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitElement = (celsiusTemperature * 9) / 5 + 32;
  let roundFahrenheit = Math.round(fahrenheitElement);
  temp.innerHTML = `${roundFahrenheit}`;
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

function showWeather(response) {
  console.log(response);
  let currentDate = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector(".temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  celsiusTemperature = response.data.temperature.current;
  currentDate.innerHTML = formatDate(response.data.time * 1000);

  getForecast(response.data.coordinates);
}

function searchCurrentCity(city) {
  let apiKey = "6ba36a1o3840c2e3de5bc4a87fd48c5t";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-form").value;
  searchCurrentCity(city);
}

function currentCity(position) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "6ba36a1o3840c2e3de5bc4a87fd48c5t";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentCity);
}

let currentLocation = document.querySelector("#current-city");

let submitCurrent = document.querySelector("#search-form");
submitCurrent.addEventListener("submit", handleSubmit);

currentLocation.addEventListener("click", getPosition);

searchCurrentCity("Lagos");
