var currentUserId = 1; // The userId is hardcoded as we currently have no auth
var propertyId = getParameterByName('propertyId');
var sellerId = getParameterByName('sellerId');
var messageUrl = './messages/' + propertyId + '/user/' + currentUserId + '/seller/' + sellerId;
var propertyUrl = './properties/' + propertyId;

// Create a new message
function createMessage(){
  var messageSubject = document.getElementById('messageSubject');
  var messageBody = document.getElementById('messageBody');

  // Check that we actually have a message
  if (messageSubject.value == '' || messageBody.value == ''){
    alert('Please enter a message & subject');
    return;
  }

  var request = new Request('./messages/', {
  	method: 'POST',
  	mode: 'cors',
  	headers: new Headers({
  		'Content-Type': 'application/json'
  	}),
    body: JSON.stringify({
  		propertyId: getParameterByName('propertyId'),
  		senderId: currentUserId,
      subject: messageSubject.value,
      message: messageBody.value
  	})
  });

  // Post to the server
  fetch(request)
  .then(function(response) {
    return response.json();
  });

  // Notify the user
  var newMessageDiv = document.getElementById('newMessage');
  newMessageDiv.innerHTML = '<div class=\"mdl-cell mdl-cell--4-col mdl-grid\"><div class=\"mdl-card mdl-shadow--2dp\"><div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\">Message Sent!</h2></div><div class=\"mdl-card__supporting-text\"><i class="material-icons" style=\"font-size: 240px;\">done</i></div></div></div>';
}

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

// Fetch the messages
fetch(messageUrl)
.then(function(response) {
  return response.json();
}).then(function(body) {

  var messageDiv = document.getElementById('messages');
  var messages = body;
  var resultingHTML = '';

  // Loop through the messages
  for (var i = 0; i < messages.length; i++) {
    var messageHTML = '<div class=\"mdl-cell mdl-cell--4-col mdl-grid\"><div class=\"mdl-card mdl-shadow--2dp\" style=\"{{messageMargin}}\"><div class=\"mdl-card__title\" style=\"{{messageStyle}}\"><h2 class=\"mdl-card__title-text\">{{subject}}</h2></div><div class=\"mdl-card__supporting-text\">{{message}}</div></div></div>';

    // Update the template with details
    messageHTML = messageHTML.replace('{{message}}', messages[i].message);
    messageHTML = messageHTML.replace('{{subject}}', messages[i].subject);

    // Update the message style
    if (messages[i].senderId == sellerId){
      messageHTML = messageHTML.replace('{{messageStyle}}', 'background-color:steelblue');
      messageHTML = messageHTML.replace('{{messageMargin}}', 'margin-left:40px;');
    }
    else{
      messageHTML = messageHTML.replace('{{messageStyle}}', 'background-color:lightgreen');
      messageHTML = messageHTML.replace('{{messageMargin}}', '');
    }

    resultingHTML += messageHTML;
  }

  // Update the page - only repaint the DOM once
  messageDiv.innerHTML = resultingHTML;
});

// Fetch the property details
fetch(propertyUrl)
.then(function(response) {
  return response.json();
}).then(function(body) {

    // Update the page with details
    var propertyName = document.getElementById('propertyName');
    var propertyDescription = document.getElementById('propertyDescription');
    var bookingUrl = document.getElementById('bookingUrl');

    // Update the DOM
    propertyName.innerHTML = body.propertyName;
    propertyDescription.innerHTML = body.propertyDescription;
    bookingUrl.href = './bookings.html?propertyId=' + propertyId;
});

// Send a new message
var newMessageDiv = document.getElementById('newMessage');

// Update the page with details
var messageHTML = '<div class=\"mdl-cell mdl-cell--4-col mdl-grid\"><div class=\"mdl-card mdl-shadow--2dp\"><div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\">Message</h2></div><div class=\"mdl-textfield mdl-js-textfield\" style=\"margin:auto;\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"messageSubject\"><label class=\"mdl-textfield__label\" for=\"messageSubject\">Message subject...</label></div><div class=\"mdl-card__supporting-text\"><div class=\"mdl-textfield mdl-js-textfield\" style=\"margin:auto;\"><textarea class=\"mdl-textfield__input\" type=\"text\" id=\"messageBody\" rows=\"5\"></textarea><label class=\"mdl-textfield__label\" for=\"messageBody\">Message body...</label></div></div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"createMessage(); return false;\">Send Message</a></div></div></div>';
newMessageDiv.innerHTML = messageHTML;
