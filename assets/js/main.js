window.addEventListener("load", () => {
  // Variables
  const cityNameInput = document.querySelector("section input");
  const findBtn = document.querySelector("section button");
  const todayName = document.querySelector(".today_Name");
  const todayDate = document.querySelector(".today_Date");
  const tempToday = document.getElementById("temp_today");
  const conditionText = document.getElementById("condition__text");
  const iconToday = document.getElementById("iconToday");
  const humidity = document.querySelector(".humidity");
  const wind = document.querySelector('.wind');
  const direction = document.querySelector('.direction');
  const day1Name = document.querySelector('.day1_Name');
  const day1Date = document.querySelector('.day1_Date');
  const tempMaxDay1 = document.getElementById("tempMax__day1");
  const tempMinDay1 = document.getElementById("tempMin__day1");
  const conditionText1 = document.getElementById("condition__text1");
  const iconDay1 = document.getElementById("iconDay1");
  const day2Date = document.querySelector('.day2_Date');
  const day2Name = document.querySelector('.day2_Name');
  const tempMaxDay2 = document.getElementById("tempMax__day2");
  const tempMinDay2 = document.getElementById("tempMin__day2");
  const conditionText2 = document.getElementById("condition__text2");
  const iconDay2 = document.getElementById("iconDay2");
  let currentData;
  let tomorrowData;
  let afterTomorrow;
  // Assuming that if geoLocation doesn't work or user doesn't search on a cityName , defaultOne = "Cairo"
  let defaultCity = "Cairo";

  // Fetching weatherData- Refreshing the page 
  fetchForecastData();


  // Function to format dayDate
function formatDate(dayDate) {
  let apiDate = new Date(dayDate);
  let day = apiDate.getDate();
  let month = apiDate.toLocaleString("default", { month: "long" });
  return `${day}${month}`;
}


// Function to get nextDay date 
function getNextDaysDate (){
  let today = new Date() ;
  let tomorrow = new Date (today)
  tomorrow.setDate(today.getDate()+1);
  let dayAfterTomorrow = new Date (today);
  dayAfterTomorrow.setDate(today.getDate()+2);
  return {
    "tomorrow" : formatDate(tomorrow),
    "dayAfterTomorrow" : formatDate(dayAfterTomorrow)
  }
}


  // Function to search for the cityForcastData
  findBtn.addEventListener("click", () => {
    fetchForecastData(
      cityNameInput.value.trim() !== "" ? cityNameInput.value.trim() : undefined
    );
  });

 
  // Function to fetch citydata
  async function fetchForecastData(cityName = undefined) {
    let forecastData;
    try {
       // if cityname is provided
    if (cityName) {
      forecastData = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=dca4d5e864f742b1ae7133652241912&q=${cityName}&days=3`
      );
      let data = await forecastData.json();
      console.log(data);
      displayWeatherData(data);
    } else {
      // if location is accessed & no cityName is provided 
      let latitude;
      let longitude;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          forecastData = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=dca4d5e864f742b1ae7133652241912&q=${latitude},${longitude}&days=3`
          );
          let data = await forecastData.json();
          console.log(data);
          displayWeatherData(data);
        } , 
        function (error){
          console.log('geoLocation Error' , error);
          fetchFallbackCityData();
        });
      } else {
        // if no location and cityName are provided then default cityName is Cairo 
        fetchFallbackCityData();
      }
    }
    } catch (error) {
      console.log('Error while fetching weather data' , error);
      alert('There was an error while fetching weather data , Please try again later')
    }
  }


  // Function to fetch weatherData for Cairo
 async function fetchFallbackCityData (){
    try {
      let forecastData = await fetch (`https://api.weatherapi.com/v1/forecast.json?key=dca4d5e864f742b1ae7133652241912&q=${defaultCity}&days=3`);
      let data = await forecastData.json() ;
      console.log(data);
      displayWeatherData(data);
    } catch (error) {
      console.log('Error while fetching fallBack city data' , error);
      alert('There was an error fetching weather data for Cairo. Please try again later')
    }
  }



  // Function to display cityData & Manipulating HTML
  function displayWeatherData(data) {
    if (data.location && data.location.name) {
      document.getElementById("city__name").innerText = `${data.location.name}`;
    } else {
      document.getElementById("city__name").innerText = `City not found`;
    }

    // manipulate weather data for today
    currentData = data.current;
    todayName.innerText = new Date(currentData.last_updated).toLocaleString("en-US", { weekday: "long" });
    tempToday.innerText = `${currentData.temp_c}°C`;
    conditionText.innerText = currentData.condition.text;
    const iconTodaySrc = currentData.condition.icon;
    iconToday.setAttribute("src", iconTodaySrc);
    todayDate.innerText = `${formatDate(currentData.last_updated)}`;
    humidity.innerText = `${currentData.humidity}%`;
    wind.innerText = `${currentData.wind_kph}km/hr`;
    direction.innerText = currentData.wind_dir;


    // manipulate weather data for tomorrow
    tomorrowData = data.forecast.forecastday[1].day;
    day1Name.innerText = new Date(data.forecast.forecastday[1].date).toLocaleString("en-US", { weekday: "long" });
    tempMaxDay1.innerText = `${tomorrowData.maxtemp_c}°C`;
    tempMinDay1.innerText = `${tomorrowData.mintemp_c}°C`;
    conditionText1.innerText = tomorrowData.condition.text;
    const iconDay1Src = tomorrowData.condition.icon;
    iconDay1.setAttribute("src", iconDay1Src);
    day1Date.innerText = `${getNextDaysDate().tomorrow}`


    // manipulate weather data for day after tomorrow
    afterTomorrow = data.forecast.forecastday[2].day;
    day2Name.innerText = new Date(data.forecast.forecastday[2].date).toLocaleString("en-US", { weekday: "long" });
    tempMaxDay2.innerText = `${afterTomorrow.maxtemp_c}°C`;
    tempMinDay2.innerText = `${afterTomorrow.mintemp_c}°C`;
    conditionText2.innerText = afterTomorrow.condition.text;
    const iconDay2Src = afterTomorrow.condition.icon;
    iconDay2.setAttribute("src", iconDay2Src);
    day2Date.innerText = `${getNextDaysDate().dayAfterTomorrow}`
  }
});



