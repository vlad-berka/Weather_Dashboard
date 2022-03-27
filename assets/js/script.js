// Javascript file

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
}

function searchCity() {

}

$(".btn").on("click", getCity_Button);