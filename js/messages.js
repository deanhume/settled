(function() {
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

  // The current propertyId and URLs
  var currentUserId = 1; // The userId is hardcoded as we currently have no auth
  var propertyId = getParameterByName('propertyId');
  var sellerId = getParameterByName('sellerId');
  var messageUrl = './messages/' + propertyId + '/user/' + currentUserId + '/seller/' + sellerId;
  var propertyUrl = './properties/' + propertyId;

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
      var messageHTML = '<div class=\"mdl-cell mdl-cell--4-col mdl-grid\"><div class=\"mdl-card mdl-shadow--2dp\" style=\"{{messageMargin}}\"><div class=\"mdl-card__title\" style=\"{{messageStyle}}\"><h2 class=\"mdl-card__title-text\">From</h2></div><div class=\"mdl-card__supporting-text\"><h6>{{subject}}</h6>{{message}}</div></div></div>';

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
})();
