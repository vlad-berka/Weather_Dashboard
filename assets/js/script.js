// Javascript file
var API_Key = '799e51a3c5dc5df506ba2f4329ae7a95';
var latitude = 0;
var longitude = 0;
var all_Weather_Data = {};

// console.log($('.card-body').children()[0].val());
console.log($('.card-body').filter('[data-id="1"]').children());
console.log($('.emoji2'));

function getCity_Button() {
    //Gets the text inside a button => the user's city choice
    var cityChoice = event.target.textContent.trim();

    // If the search button is clicked
    if (cityChoice == "Search") {
        //Get the entered value from the text area
        var enteredCity = $(".form-control").val();
        //If nothing there, set default to San Diego
        if (enteredCity == "") {
            cityChoice = "San Diego";
        }
        // Otherwise entered city becomes the choice
        else {
            cityChoice = enteredCity;
        }
    }
    // Implied else, set text at header to the city choice
    $(".displayCity").text(cityChoice);
    get_LatLong(cityChoice);
}

function get_LatLong(cityString) {
    var API_URL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityString + "&limit=1&appid=" +API_Key;
    console.log("Fetching Lat and Long for: " +cityString);
    console.log("URL is: "+API_URL);

    fetch(API_URL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        latitude = data[0].lat;
        longitude = data[0].lon;
        get_Weather();
    });
}

function get_Weather() {
    var API_URL = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&appid="+API_Key;
    console.log("Fetching weather at: " +latitude+", "+longitude);
    console.log("URL is: "+API_URL);

    fetch(API_URL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // $('.card-body[data-id="0"]')
        // console.log(data);
        // console.log(data.current.humidity);
        // temp
        // windspeed
        // humidity
        // uv
        console.log(data);
        print_Data(data);
    });
}

function print_Data(data) {
    console.log("Printing data to the dom");

    $(".displayTemp").text("Temp: " +(Math.floor((data.current.temp-273)*9/5)+32) +" °F");
    $(".displayWind").text("Windspeed: " +data.current.wind_speed +" MPH");
    $(".displayHumidity").text("Humidity: " +data.current.humidity +" %");
    $(".UV_Box").text(data.current.uvi + " Index");

    for(var i=1; i<6; i++){
        console.log(i + " icon " +data.daily[i-1].weather[0].icon);
        $('.emoji'+i)[0].attributes[1].textContent = "https://openweathermap.org/img/wn/"+data.daily[i-1].weather[0].icon +"@2x.png";
        $('.card-body').filter('[data-id="'+i+'"]').children()[2].textContent = "Temp: " +(Math.floor((data.daily[i-1].temp.day-273)*9/5)+32) +" °F";
        $('.card-body').filter('[data-id="'+i+'"]').children()[3].textContent = "Wind: " +data.daily[i-1].wind_speed +" MPH";
        $('.card-body').filter('[data-id="'+i+'"]').children()[4].textContent = "Humidity: " +data.daily[i-1].humidity +" %";
    }
}

$(".btn").on("click", getCity_Button);