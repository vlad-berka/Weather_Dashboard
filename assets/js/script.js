// Javascript file

function getCity_Button() {
    //Gets the text inside a button => the user's city choice
    var cityChoice = event.target.textContent.trim();

    // If the search button is clicked
    if (cityChoice == "Search") {
        //get
        var enteredCity = $(".form-control").val();
        if (enteredCity = "") {
            //Do nothing
        }
        else {
            cityChoice = enteredCity;
        }
        console.log("Search button clicked");
        console.log($(".form-control").val());
    }
        $(".displayCity").text(cityChoice);
}

function searchCity() {

}

$(".btn").on("click", getCity_Button);