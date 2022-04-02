// Javascript file
var savedData = JSON.parse(localStorage.getItem("savedDataWeather"));

function getCity_Button() {
    //Gets the text inside a button => the user's city choice
    var cityChoice = event.target.textContent.trim();

    // If the search button is clicked
    if (cityChoice == "Search") {
        //Get the entered value from the text area
        var enteredCity = $(".form-control").val();
        //If nothing there, do nothing
        if (enteredCity) {
            cityChoice = enteredCity;
        }
        else {
            return;
        }
    }
    else {
        $(".displayCity").text(cityChoice);
        saveData_Fun(cityChoice);
        get_LatLong(cityChoice);
    }
}

function get_LatLong(cityString) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityString + "&limit=1&appid=799e51a3c5dc5df506ba2f4329ae7a95")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        get_Weather(data[0].lat, data[0].lon);
    });
}

function get_Weather(latitude, longitude) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&appid=799e51a3c5dc5df506ba2f4329ae7a95")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        print_Data(data);
    });
}

function print_Data(data) {
    $(".displayTemp").text("Temp: " +(Math.floor((data.current.temp-273)*9/5)+32) +" °F");
    $(".displayWind").text("Windspeed: " +(Math.floor(data.current.wind_speed)) +" MPH");
    $(".displayHumidity").text("Humidity: " +data.current.humidity +" %");
    $(".UV_Box").text(data.current.uvi + " Index");

    for(var i=1; i<6; i++){
        $('.card-body').filter('[data-id="'+i+'"]').children()[0].textContent = moment().add(i, 'days').format('MM/DD/YY');
        $('.emoji'+i)[0].attributes[1].textContent = "https://openweathermap.org/img/wn/"+data.daily[i-1].weather[0].icon +"@2x.png";
        $('.card-body').filter('[data-id="'+i+'"]').children()[2].textContent = "Temp: " +(Math.floor((data.daily[i-1].temp.day-273)*9/5)+32) +" °F";
        $('.card-body').filter('[data-id="'+i+'"]').children()[3].textContent = "Wind: " +(Math.floor(data.daily[i-1].wind_speed)) +" MPH";
        $('.card-body').filter('[data-id="'+i+'"]').children()[4].textContent = "Humidity: " +data.daily[i-1].humidity +" %";
    }
}

function checkForData() {
    console.log("checking for data");
    //If no data present, create localData
    if (savedData==null){
        savedData = [];
        savedData.push("Seattle"); 
    }
    //Else, start populating buttons
    else {
        console.log("populate buttons");  
    }
    localStorage.setItem("savedDataWeather", JSON.stringify(savedData));
}

function saveData_Fun(newEntry) {
    if(savedData.length == 8) {
        savedData.shift();
    }
    savedData.append(newEntry);
    localStorage.setItem("savedDataWeather", JSON.stringify(savedData));
    console.log(savedData);
}

checkForData();
get_LatLong("Seattle");
$(".btn").on("click", getCity_Button);