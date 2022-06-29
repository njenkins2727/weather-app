
//variables
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchCity = document.getElementById('city-search');
const currentTemp = document.getElementById('current-day-temp');
const currentWind = document.getElementById('current-day-wind');
const currentHumidity = document.getElementById('current-day-humidity');
const currentUv = document.getElementById('current-day-uv');
const currentImg = document.getElementById('current-img');


const APIKey = 'a6ea7278c8f0214a93dedada3c323ef4';

function getOneCallApi(lat, lon){

    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
    .then(function(res){
        return res.json()
    })
}

function getWeatherData(city){

    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`)
    .then(function(response){
        return response.json();
    })
    .then(function(currentWeather){
        // console.log(currentWeather);
        return getOneCallApi(currentWeather.coord.lat, currentWeather.coord.lon);
    })
}

//helper function
function getLocalStorage(key){
  return JSON.parse(localStorage.getItem(key)) || [];
}

//main localstorage function
function storeLocations(key, inputname){

 //get the prevSearch array 
 const prevSearch = getLocalStorage(key)

 //push new userInput into array 
 prevSearch.push(inputname);

 if (prevSearch.length > 2) {
     prevSearch.splice(0, 1);
 }

 // resave this new array into local sotrage 
 localStorage.setItem(key, JSON.stringify(prevSearch))

}


//when user clicks on search button 
searchForm.addEventListener('submit', function(event){
    event.preventDefault();

  // get user input 
 const userInput = searchInput.value;

  //fetch weather data based on city name 
  getWeatherData(userInput)
 .then (function (weatherData){
     console.log(weatherData);

  // Populate the data into the dom
   //current day
   const datetime = moment(weatherData.current.dt, 'X').format("DD-MM-YYYY")
   console.log(datetime);
   searchCity.innerHTML = `${userInput} ${datetime}` //add icon 
   currentHumidity.textContent = weatherData.current.humidity + "%";
   currentTemp.textContent = weatherData.current.temp + " ℃";
   currentWind.textContent = weatherData.current.wind_speed + " km/h";
   currentUv.textContent = weatherData.current.uvi;

   if(weatherData.current.uvi < 3){
       currentUv.classList.add('uv-low');
   } else if (weatherData.current.uvi >= 3){
    currentUv.classList.add('uv-moderate');
   }else if (weatherData.current.uvi > 5){
    currentUv.classList.add('uv-high');
   }else if (weatherData.current.uvi > 7)
    currentUv.classList.add('uv-very-high');
   

   const dailyIcon = weatherData.current.weather[0].icon;
    const iconUrl = "http://openweathermap.org/img/w/" + dailyIcon +".png";
   currentImg.src = iconUrl
   dailyfunction(weatherData.daily);

   storeLocations('cities', userInput);

 let cityNames = JSON.parse(localStorage.getItem('cities')) ||[];

  function diffName(cities){
      return `${cities}`;
  }

  const newBtn = document.createElement('button');
  newBtn.setAttribute('id', 'new-button');

  for (let i = 0; i < cityNames.length; i++) {
      const showCity = cityNames[i];

      const locations = diffName(showCity);

      newBtn.textContent = locations;

      searchForm.append(newBtn);

    //   if (showCity[0]) {
    //       newBtn.classList.add('hide');
    // }

  }



})

})

function dailyfunction(dailyForcast){
    const futureForcast = moment(dailyForcast[1].dt, 'X').format("DD-MM-YYYY")
    const dailyIcon = dailyForcast[0].weather[0].icon;
    const iconurl = "http://openweathermap.org/img/w/" + dailyIcon +".png";
    const futureContainer = document.getElementById('wrapper');
    const cardContainer = 
    `<div class="card">
        <div class="card-body">
            <h4 class="card-title" id="day-one">${futureForcast}</h4>
                <div class="card-text">
                    <p>Temp: <span id="day-one-temp">${dailyForcast[1].temp.day + " ℃"}</span></p>
                    <p>Wind: <span id="current-day-wind">${dailyForcast[1].wind_speed + " km/h"}</span></p>
                    <p>Humidity: <span id="current-day-humidity">${dailyForcast[1].humidity + " %"}</span></p>
                    <img id="daily-img" src="${iconurl}" alt="Weather Icon">
                </div>
        </div>
    </div> `
                      
            futureContainer.innerHTML += cardContainer;

            for (let i = 2; i < 6; i++) {
                const futureForcast = moment(dailyForcast[i].dt, 'X').format("DD-MM-YYYY")
                const futureContainer = document.getElementById('wrapper');

                const dailyIcon = dailyForcast[i].weather[0].icon;
                const iconurl = "http://openweathermap.org/img/w/" + dailyIcon +".png";
            
                const cardContainer = 
    `<div class="card">
        <div class="card-body">
            <h4 class="card-title" id="day-one">${futureForcast}</h4>
                <div class="card-text">
                    <p>Temp: <span id="day-one-temp">${dailyForcast[i].temp.day + " ℃"}</span></p>
                    <p>Wind: <span id="current-day-wind">${dailyForcast[i].wind_speed + " km/h"}</span></p>
                    <p>Humidity: <span id="current-day-humidity">${dailyForcast[i].humidity + " %"}</span></p>
                    <img id="daily-img" src="${iconurl}" alt="Weather Icon">
                </div>
        </div>
    </div> `
            
    futureContainer.innerHTML += cardContainer;
            }
}