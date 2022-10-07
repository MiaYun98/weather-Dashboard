// variable setting 
var historyList = document.querySelector('#history');
var inputEl = document.querySelector('.form-input');
var forecastEl = document.querySelector('.forecast');
var resultPage = document.querySelector(".result");
var saveEl = [];

var cityname = ""

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
    
    // for(var i = 0; i < saveEl.length; i++) {
    //     if (saveEl[i] !== searchName) {
    //         console.log("repeated");
    //         return;
    //     } 
    // }
    forecastEl.textContent = "";
    inputEl.value = "";
    // next function which is searching the data
    cityname = searchName;
    // url goes to the java script with the fetch 
    weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=416af2287105033badad2b026eeca30c"
    getWeatherInfo(weatherUrl);
}

// with the url getting the weather data
function getWeatherInfo(request) {
    fetch(request)
    .then(function (response) {
        if (response.ok) {
            console.log(response);  
            response.json()
            .then(function (data) {
                console.log(data.list);
                history();
                // todayweather(data);
                fivedayweather(data);
            });
        } else {
            alert('Error ' + response.statusText)
        }   
    })
    .catch(function (error) {
        alert('unable to connet to the Weather Data')
    });
}

// function todayweather() {
    
//     var bigBox = $(".forecast")
//     var day = document.createElement('ul');
//     var list = document.createElement('li');
//     day.appendChild(list);
//     bigBox.appendChild(day);
// }

// println the data into the box for the five day weather information
function fivedayweather(data) {
    resultPage.classList.remove("hidden");
    for (var i = 0; i < 40; i+=8) {
        var thread = document.createElement('thread');
        var tr = document.createElement('tr');
        var th = document.createElement('th')

        th.textContent = data.list[i].dt_txt + `\n
        temp: ` + data.list[i].main.temp + `
        weather: ` + data.list[i].weather[0].main + `
        wind: ` + data.list[i].wind.speed + `
        humidity: ` + data.list[i].main.humidity;

        tr.appendChild(th);
        thread.appendChild(th);
        console.log(th)
        thread.setAttribute("class", "col-lg-2 col-12 five")
        forecastEl.appendChild(thread);
    }
    
}

function local() {
    localStorage.setItem("saveEl",JSON.stringify(saveEl));  
}

function history() { 
    //for loop to not repeat the same things on the list
    var historyEl = document.createElement('li');
    historyEl.setAttribute("id","button");
    historyEl.textContent = cityname.toLowerCase();
    historyList.appendChild(historyEl);
    console.log(cityname);
}

submitFormEl.on('submit', gettingInfo);
resultPage.classList.add("hidden");