(function() {
  var propertyUrl = './properties/';

  // Fetch the properties
  fetch(propertyUrl)
  .then(function(response) {
    return response.json();
  }).then(function(body) {

    var propertyDetails = body.properties.property;
    var mainBody = document.getElementById('main');
    var result = '';

    for (var i = 0; i < propertyDetails.length; i++) {
      var propertyHTML = '<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\" style=\"margin-bottom: 20px;\"><div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\">{{propertyName}}</h2></div><div class=\"mdl-card__supporting-text\"><img src=\"{{imageUrl}}\" /><p style=\"width: 300px;float: right;\">{{propertyDescription}}</p></div><div class=\"mdl-card__actions mdl-card--border\"><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" href=\"{{bookingUrl}}\">Make a booking</a><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" href=\"{{messageUrl}}\">Message the seller</a></div><div class=\"mdl-card__menu\"><button class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\"><i class=\"material-icons\">share</i></button></div></div>';

      var property = propertyDetails[i];
      var propertyDescription = property.propertyDescription;
      var propertyName = property.propertyName;
      var imageUrl = './data/images/' + (i + 1) + '.jpg'; // This should ideally come from the DB

      propertyHTML = propertyHTML.replace('{{propertyName}}', propertyName);
      propertyHTML = propertyHTML.replace('{{propertyDescription}}', propertyDescription);
      propertyHTML = propertyHTML.replace('{{imageUrl}}', imageUrl);
      propertyHTML = propertyHTML.replace('{{bookingUrl}}', './bookings.html?propertyId=' + property.propertyId);
      propertyHTML = propertyHTML.replace('{{messageUrl}}', './messages.html?propertyId=' + property.propertyId + '&sellerId=' + property.sellerId);

      result += propertyHTML;
    }

    // Update the DOM once
    mainBody.innerHTML = result;
  });
})();
