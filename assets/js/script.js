// variable setting 
var historyList = document.querySelector('#history');
var inputEl = document.querySelector('.form-input');
var forecastEl = document.querySelector('.forecast');
var resultPage = document.querySelector(".result");
var currentEl = $('.current');
var buttonclickEl = $('#history');
var cityName = "";
var saveList = [];

// day information
var currentTime = moment();
$(".time").text(currentTime.format("MMM Do, YYYY"));

// submitting the variable
var submitFormEl = $("#search-form");

// getting the input information
function gettingInfo (event) {
    event.preventDefault();
    var searchName = inputEl.value.trim();
    if (!searchName) {
        alert("should write something");
        return;
    }
    //emptying the directory that we previously created
    currentEl.textContent = "";
    forecastEl.textContent = "";
    inputEl.value = "";
    gettingUrl(searchName);
}

function gettingUrl(searchName) {
    // next function which is searching the data
    // url goes to the java script with the fetch 
    weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchName + "&units=imperial&appid=416af2287105033badad2b026eeca30c"
    todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchName + "&units=imperial&appid=416af2287105033badad2b026eeca30c"
    getWeatherInfo(weatherUrl);
    gettodayweather(todayUrl);
}

// with the url getting the weather data
function getWeatherInfo(request) {
    fetch(request)
    .then(function (response) {
        if (response.ok) {
            response.json()
            .then(function (data) {
                fivedayweather(data);
            });
        } else {
            alert('Error ' + response.statusText)
        }   
    })
    .catch(function (error) {
        alert('unable to connect to the Weather Data')
    });
}

// getting current weather API fetching them in to readable data
function gettodayweather(request) {
    fetch(request)
    .then(function (response) {
        if (response.ok) {
            response.json()
            .then(function (data) {
                todayweather(data);
            });
        } else {
            alert('Error ' + response.statusText)
        }   
    })
    .catch(function (error) {
        alert('unable to connet to the Weather Data')
    });
}

// current weather from the second API
function todayweather(data) {
    var statename = document.querySelector(".search-current");
    statename.textContent = data.name;
    var img = document.createElement('img');
    var currentIcon = "http://openweathermap.org/img/wn/"+ data.weather[0].icon +"@2x.png";
    img.setAttribute('src', currentIcon);
    img.setAttribute('alt', data.weather[0].description);
    var currentInfo = document.querySelector(".current-info");
    currentInfo.innerHTML =`temp: ${data.main.temp} ??F` + "<br>"
    currentInfo.innerHTML +=`wind: ${data.wind.speed} MPH` + "<br>"
    currentInfo.innerHTML += `humidity: ${data.main.humidity} %`
    statename.appendChild(img);
    var dataName = data.name;
    listofName(dataName);
}

// if there are redundent search history return 
function listofName(name) {
    cityName = name;
    console.log(cityName)
    for(var i = 1; i < saveList.length; i++) {
        if (saveList[i] === name) {
            return;
        }
    }
    if (saveList.length >= 8) {
        saveList.push(`${name}`);
        saveList.pop();
    } else {
        saveList.push(`${name}`);  
    }
    //with the added thing render the history again
    console.log(saveList)
    local();
}

// println the data into the box for the five day weather information
function fivedayweather(data) {
    resultPage.classList.remove("hidden");
    for (var i = 5; i < data.list.length; i+=8) {
        var thread = document.createElement('thread');
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var td = document.createElement('td')
        var img = document.createElement('img');
        tr.textContent = data.list[i].dt_txt;
        var iconLink = "http://openweathermap.org/img/wn/"+ data.list[i].weather[0].icon +"@2x.png";
        img.setAttribute('src', iconLink);
        img.setAttribute('alt', data.list[i].weather[0].main);

        td.innerHTML =`temp: ${data.list[i].main.temp} ??F` + "<br>"
        td.innerHTML +=`wind: ${data.list[i].wind.speed} MPH` + "<br>"
        td.innerHTML += `humidity: ${data.list[i].main.humidity} %`
        
        tr.appendChild(img);
        tr.appendChild(td);
        tr.appendChild(th);
        thread.appendChild(tr);
        thread.setAttribute("class", "col-lg-2 col-12 five");
        forecastEl.appendChild(thread);
    }
}

// local storage
function local() {
    localStorage.setItem("saveList",JSON.stringify(saveList)); 
    historyrender(); 
}

function historyrender() { 
    // for loop to not repeat the same things on the list
    var output = JSON.parse(localStorage.getItem("saveList"));
    console.log(output)
    saveList = output;
    if (saveList === null) {
        saveList = [cityName];
        return;
    } else {
        historyList.textContent = "";
        for (var i = 1; i < saveList.length; i++) {
            var historyEl = document.createElement('button');
            historyEl.setAttribute("class","recallBtn");
            historyEl.setAttribute("data-name", saveList[i]);
            historyEl.textContent = saveList[i];
            historyList.appendChild(historyEl);
        }   
    }
    
}

//getting the name which is at the left side history result
function gettingHistoryName(event) {
    var searching = event.target.getAttribute('data-name');
    currentEl.textContent = "";
    forecastEl.textContent = "";
    inputEl.value = "";
    gettingUrl(searching);
}

console.log(saveList)
buttonclickEl.on('click', gettingHistoryName);
submitFormEl.on('submit', gettingInfo);
resultPage.classList.add("hidden");
historyrender();
