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

// Fetch the bookings for this property
function fetchBookings(dateToCheck){
  var bookingUrl = '/bookings/' + propertyId + '/date/' + dateToCheck;

  console.log(dateToCheck);

  fetch(bookingUrl)
  .then(function(response) {
    return response.json();
  }).then(function(body) {

  });
}

// Create a new booking
function createBooking(){

}
