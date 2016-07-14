// Get the details from the querystring
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  url = url.toLowerCase();
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var propertyId = getParameterByName('propertyId');
var currentUserId = 1; // The userId is hardcoded as we currently have no auth

// Fetch the bookings for this property
function fetchBookings(dateToCheck){
  var bookingUrl = '/bookings/' + propertyId + '/date/' + dateToCheck;

  // Let's check to see what booking slots are free
  fetch(bookingUrl)
  .then(function(response) {
    return response.json();
  }).then(function(body) {

    // Start the options fresh again
    clearBookingSlots();

    // Create the selector
    for (var i = 0; i < body.length; i++) {

      // Update according to timezone
      var datePlusTimeZone = new Date(body[i].bookingDate);
      datePlusTimeZone.setHours(datePlusTimeZone.getHours() - datePlusTimeZone.getTimezoneOffset() / 60);

      var bookingTimeSlot = datePlusTimeZone.getUTCHours();

      // Update the selector with enabled / disabled
      // Not ideal as this is O(n) time complexity
      var dateSelectOptions = document.getElementById('dateSelect').getElementsByTagName('option');
      for (var x = 0; x < dateSelectOptions.length; x++) {
        if (dateSelectOptions[x].value == bookingTimeSlot){
          dateSelectOptions[x].disabled = true;
        }
      }
    }

    // Show the picker
    var timePickerCard = document.getElementById('timePicker');
    timePickerCard.style.visibility = 'visible';
  });
}

// We want to ensure that each time we request new booking slots that we are cleared
function clearBookingSlots() {
  var dateSelectOptions = document.getElementById('dateSelect').getElementsByTagName('option');
  for (var x = 0; x < dateSelectOptions.length; x++) {
      dateSelectOptions[x].disabled = false;
  }
}

// Create a new booking
function createBooking(){
  var selectedDate = document.getElementById('dateSelect');

  // Ensure that the user selected something
  if (selectedDate.selectedIndex == -1){
    return null;
  }

  var chosenTimeSlot = selectedDate.options[selectedDate.selectedIndex].value;
  var chosenDateTime = new Date(picker._d.getFullYear(), picker._d.getMonth() - 1, picker._d.getDate(), chosenTimeSlot);

  var request = new Request('./bookings/', {
  	method: 'POST',
  	mode: 'cors',
  	headers: new Headers({
  		'Content-Type': 'application/json'
  	}),
    body: JSON.stringify({
  		propertyId: getParameterByName('propertyId'),
      bookingDate: chosenDateTime,
      bookerId: currentUserId,
      bookingId: Math.floor(Math.random() + 1) // This would be a primary key in the DB
  	})
  });

  // Post to the server
  fetch(request)
  .then(function(response) {
    var timePicker = document.getElementById('timePicker');
    timePicker.innerHTML = '<div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\">Booking made - thank you!</h2></div><div class=\"mdl-card__supporting-text\"><i class="material-icons" style=\"font-size: 240px;\">done</i></div>';
   });
}

var propertyUrl = './properties/' + propertyId;

// Fetch the property details
fetch(propertyUrl)
.then(function(response) {
  return response.json();
}).then(function(body) {

    // Update the page with details
    var propertyName = document.getElementById('propertyName');
    var propertyDescription = document.getElementById('propertyDescription');

    // Update the DOM
    propertyName.innerHTML = body.propertyName;
    propertyDescription.innerHTML = body.propertyDescription;
});
