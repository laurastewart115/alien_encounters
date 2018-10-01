/*Current Build: v1.0

v0.2 Changelog:
Added necessary variables for localStorage
Implemented localStorage and error checking
Remove sawship.addEventListener at line 48
Refactored all variables with camelCase for readability
Need to fix FIXMEs
Need to implement UFO/Alien description textboxes to show up when page is
reloaded if the local storage determines they should be shown

v0.3 Changelog:
Alien/UFO description textboxes now show up when the page is reloaded if they
need to be shown
specify is now stored and displayed when it needs to be
Refactored localStorage retrieval into a nested if that only checks if
localStorage exists once - I left the old code in comments just in case
Fixed all the FIXMEs

v0.4 Changelog:
Removed commented out legacy code.

v0.5 Changelog:
Added error checking and JSON for time
*/

window.addEventListener("DOMContentLoaded", function() {

    //setting elements needed as variables for later use
    var encounter = document.getElementById("encounter");
    var specify = document.getElementById("specify");
    var sawAlien = document.getElementById("sawAlien");
    var describeAlien = document.getElementById("describeAlien");
    var describeAlienText = document.getElementById("describeAlienText")
    var describeUFO = document.getElementById("describeUFO");
    var describeUFOText = document.getElementById("describeUFOText");
    var submit = document.getElementById("submit");
    var notesText = document.getElementById("notesText");
    var time = document.getElementById("time");
    var errorFormat = document.getElementById("errorFormat");
    var errorInvalid = document.getElementById("errorInvalid");

    encounter.addEventListener("change", function() {
        // display "please specify" text field
        if (encounter.value == "Other") {
            specify.style = "display: block";
        } else {
            specify.style = "display: none";
        }

        // display UFO description form fields
        if (encounter.value == "UFO Sighting") {
            describeUFO.style = "display: block";
        } else {
            describeUFO.style = "display: none"
        }
    });

    // display form fields if they saw an alien
    sawAlien.addEventListener("change", function() {
        if (sawAlien.checked) {
            describeAlien.style = "display: block";
        } else {
            describeAlien.style = "display: none";
        }
    });

    // makes sure time is in the correct format and displays error message
    time.addEventListener("change", function() {
        if (!time.value.match(/\d{2}:\d{2}/)) {
            errorFormat.style.display = "block";
        } else {
            errorFormat.style.display = "none";
        }
    });

    //retrieving localStorage
    if(localStorage) {
        if (localStorage.encounter) {
            encounter.value = localStorage.encounter;

            // display "specify" field if "Other" is selected
            if(encounter.value=="Other" && localStorage.specify) {
                specify.value = localStorage.specify;
                specify.style = "display: block";
            }
        }

        // display describeUFO if "UFO Sighting" is selected
        if(localStorage.describeUFOText && encounter.value == "UFO Sighting") {
            describeUFOText.value = localStorage.describeUFOText;
            describeUFO.style.display = "block";
        } else {
            describeUFO.style.display = "none";
        }

        // display describeAlien if sawAlien is checked
        if(localStorage.sawAlien == "true") {
            sawAlien.checked = localStorage.sawAlien;
            describeAlien.style.display = "block";
            describeAlienText.value = localStorage.describeAlienText;
        } else {
            sawAlien.checked = false;
            describeAlien.style.display = "none";
        }

        if (localStorage.notesText) {
            notesText.value = localStorage.notesText;
        }

        if (localStorage.time) {
            time.value = JSON.parse(localStorage.time)[0] + ":" + JSON.parse(localStorage.time)[1];
        }

    }

    //function that stores form data into localStorage if the form is complete
    submit.addEventListener("click", function(e) {
        var errorChecked = 1;
        var timeArray = new Array;

        //conditions that should stop submission due to incomplete form
        if (encounter.value == "- Please Select -") {
            errorChecked = 0;
        } else if (notesText.value == "") {
            errorChecked = 0;
        } else if (encounter.value == "UFO Sighting" && describeUFOText.value == "") {
            errorChecked = 0;
        } else if (encounter.value == "Other" && specify.value == "") {
            errorChecked = 0;
        } else if (sawAlien.checked && describeAlienText.value == "") {
            errorChecked = 0;
        } else if (!time.value.match(/\d{2}:\d{2}/)) {
            errorChecked = 0;
        } else if (time.value.match(/\d{2}:\d{2}/)) { // make sure time is valid
            var timeSplit = time.value.split(":");
            if(timeSplit[0] > 24 || timeSplit[1] > 59) {
                errorInvalid.style.display = "block";
                errorChecked = 0;
            } else {
                errorInvalid.style.display = "none";
                timeArray = [timeSplit[0], timeSplit[1]];
            }
        }

        //storing into localStorage
        if (localStorage && errorChecked == 1) {
            localStorage.encounter = encounter.value;

            if(encounter.value == "Other") {
                localStorage.specify = specify.value;
            }

            localStorage.describeUFOText = describeUFOText.value;
            localStorage.sawAlien = sawAlien.checked;
            localStorage.describeAlienText = describeAlienText.value;
            localStorage.notesText = notesText.value;

            var jTime = JSON.stringify(timeArray);
            console.log("value being stored: " + jTime);
            localStorage.time = jTime;

            alert("Your notes have been saved! Good work detective!");

        } else { // preventing the submission because error check failed
            alert("Please fill in all necessary fields.")
            e.preventDefault();
        }
    });
}); //end of DOMContentLoaded
