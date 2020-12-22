let tempElement = document.querySelector('.temperature')
let descElement = document.querySelector('.weather-info');
let iconElement = document.querySelector('.weather-icon')
let locElement = document.querySelector('.location')
let notiElement = document.querySelector('.notification')
let container = document.querySelector('.container')

let weather_data


let weather = {
    temperature:{
        value:30,
        unit: 'celsius',
        unit_symbol:'C',
    },
    description:'clear',
    iconId:'01d',
    city:'Hyderabad',
    country:'IN'
}

function displayWeather(){
    iconElement.innerHTML = `<img src="${weather.iconId}.png">`;
    tempElement.innerHTML = `${weather.temperature.value} &deg; <span>${weather.temperature.unit_symbol}</span>`;
    descElement.innerHTML = `${weather.description}`
    locElement.innerHTML = `${weather.city}, ${weather.country}`
}

function change_units(){
    if(weather.temperature.unit==='celsius'){
        weather.temperature.value =((weather.temperature.value*9/5) +32).toFixed(1)
        weather.temperature.unit='fahrenheit'
        weather.temperature.unit_symbol='F'
    }
    else{
        weather.temperature.value = ((weather.temperature.value -32 ) * 5/9).toFixed(1)
        weather.temperature.unit='celsius'
        weather.temperature.unit_symbol='C'
    }
    displayWeather()
}


// getting position of user 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(got_location)
    }else{
        notiElement.innerHTML = 'Geolocation not supported by your device'
    }
}

// getting latitude and longitude
function got_location(position){
    let lat = position.coords.latitude
    let lon = position.coords.longitude
    console.log('lon: ' + lon)
    console.log('lat: ' + lat )

    get_weather_current(lat,lon)
}

async function get_weather_current(lat,lon){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    let response = await fetch(api)
    weather_data = await response.json()
    console.log(weather_data)
    update_weather_info(weather_data)
}

async function get_weather_city(city){
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    let response = await fetch(api)
    weather_data = await response.json();
    console.log(weather_data)
    update_weather_info(weather_data)
}


function update_weather_info(weather_data){
    error_handling(weather_data.cod)
    weather.temperature.value = Math.floor(weather_data.main.temp) - 273
    weather.temperature.unit = 'celsius'
    weather.city = weather_data.name
    weather.country = weather_data.sys.country
    weather.iconId = weather_data.weather[0].icon
    weather.description = weather_data.weather[0].description

    displayWeather()
}



let apiKey = '03e4f33556149a3a3cf928abf2df4bd7'

// used to change the location
function change_loc(){
    let location = prompt("Type in current for getting current location's weather    (OR)   enter a city for the weather there").toLowerCase()

    if(location ==='current'){
        getLocation()
    }
    else{
        get_weather_city(location)
    }
}


// handls error by telling user what is right and wrong
function error_handling(cod){
    if(cod === '404'){
        notiElement.innerHTML = 'City not found'
    }else if(cod==='400'){
        notiElement.innerHTML = 'Enter a city'
    }else if(cod==='401'){
        notiElement.innerHTML = 'invalid api key'
    }
    else{
        notiElement.innerHTML = ''
    }
}


tempElement.addEventListener('click', change_units)
getLocation()
displayWeather()
locElement.addEventListener('click',change_loc)

