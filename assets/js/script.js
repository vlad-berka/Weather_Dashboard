// Javascript file
var savedData = JSON.parse(localStorage.getItem("savedDataWeather"));

function getCity_Button() {
    //Gets the text inside a button => the user's city choice
    var cityChoice = event.target.textContent.trim();

    // If the search button is clicked
    if (cityChoice == "Search") {
        console.log("search button clicked");
        //Get the entered value from the text area
        var enteredCity = $(".form-control").val();
        //If nothing there, do nothing
        console.log(enteredCity);
        if (enteredCity) {
            cityChoice = enteredCity;
            saveLocalStorage(cityChoice);
        }
        else {
            return;
        }
    }
    else {
        console.log("citybutton clicked: " +cityChoice);
    }
    $(".displayCity").text(cityChoice + " ("+moment().format('MM/DD/YY')+")");
    get_LatLong(cityChoice);
}

function get_LatLong(cityString) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityString + "&limit=1&appid=799e51a3c5dc5df506ba2f4329ae7a95")
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
    console.log("in print data");
    $('.emoji0').attr('src', "https://openweathermap.org/img/wn/"+data.current.weather[0].icon +"@2x.png");
    $(".displayTemp").text("Temp: " +(Math.floor((data.current.temp-273)*9/5)+32) +" °F");
    $(".displayWind").text("Windspeed: " +(Math.floor(data.current.wind_speed)) +" MPH");
    $(".displayHumidity").text("Humidity: " +data.current.humidity +" %");
    $(".UV_Box").text(data.current.uvi + " Index");
    update_UV_Color(data.current.uvi);

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
        populateButtons();
    }
    //Else, start populating buttons
    else {
        console.log("populate buttons");  
        populateButtons();
    }
    localStorage.setItem("savedDataWeather", JSON.stringify(savedData));
}

function saveLocalStorage(newEntry) {
    if(savedData.length == 8) {
        savedData.shift();
        savedData.push(newEntry);
    }
    else {
        savedData.push(newEntry);
        // $('.button_Container').append($('<button>').attr("type","button").addClass("btn btn-secondary btn-lg btn-block").text(newEntry));
    }
    // $('.button_Container').append($('<button>').attr("type","button").addClass("btn btn-secondary btn-lg btn-block").text(newEntry));
    populateButtons();
    localStorage.setItem("savedDataWeather", JSON.stringify(savedData));
    location.reload();
}

function populateButtons() {
    $('.button_Container').text("");
    $('.button_Container').append($('<h2>').attr("style","font-weight: bold").text("Search for a City:"));
    $('.button_Container').append($('<input>').attr("type","text").addClass("form-control").attr("placeholder","Enter a City...").attr("aria-label","City name search"));
    $('.button_Container').append($('<br>'));
    $('.button_Container').append($('<button>').attr("type","button").addClass("btn btn-primary btn-lg btn-block").text("Search"));
    $('.button_Container').append($('<hr>').attr("style","style1"));

    for(var i=savedData.length; i>0; i--){
        console.log(savedData[i-1]);
        $('.button_Container').append($('<button>').attr("type","button").addClass("btn btn-secondary btn-lg btn-block").text(savedData[i-1]));
    }
    $(".displayCity").text(savedData[savedData.length-1] + " ("+moment().format('MM/DD/YY')+")");
    get_LatLong(savedData[savedData.length-1]);
}

function update_UV_Color(UV_Index) {
    console.log((UV_Index));
    var red_ = 255;
    var green_ = 0;
    var blue_ = 0;
    if(UV_Index > 11) {
        //If greater than 11, make it red
        $(".UV_Box").attr("style", "background-color: rgb(255,0,0)");
    }
    else {
        //red linear interpolation. 255 down to 105 over 11
        if(UV_Index>5){
            red_ = 255;
            green_ = Math.floor(183-UV_Index*(183-0)/(11-5));
        }
        else {
            red_ = Math.floor(105+UV_Index*(255-105)/5);
            green_ = 183;
        }
        var blue_ = Math.floor(76-UV_Index*(76-0)/11);
        $(".UV_Box").attr("style", "background-color: rgb(" +red_+","+green_+","+blue_+")");
    }
}

checkForData();
get_LatLong("Seattle");
$(".btn").on("click", getCity_Button);