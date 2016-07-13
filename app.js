var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

// App settings
app.use(bodyParser());

// Add our assets folder (css, js, etc.)
app.use("/data", express.static(__dirname + '/data'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use(express.static('public'));

// Messages - Get by property
app.get('/messages/:propertyId/user/:userId?/seller/:sellerId?', function (req, res) {
  // Check if we received a propertyId
  var propertyId = req.params.propertyId;
  if (propertyId === undefined) {
    res.status(400).send('Missing propertyId');
  }

  var userId = req.params.userId;
  var sellerId = req.params.sellerId;

  // Read the file per propertyId
  var filePath = './data/messages/property-' + propertyId + '.json';
  fs.readFile(filePath, 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading message or no such property.');
      }

      // Parse the data
      var obj = JSON.parse(data);
      var result = [];

      try {
        // Loop through the result and find any matches
        for (var i = 0; i < obj.messages.message.length; i++) {
          var message = obj.messages.message[i];
          // check if its either the seller or current user
          if (message.senderId == userId || message.senderId == sellerId){
            result.push(message);
          }
        }
      } catch (e) {
        es.status(500).send('Error reading message or no such property.');
      }

      res.json(result);
  });
});

// Messages - Create
//curl -X POST -H 'Content-Type: application/json' -d '{"propertyId":"1","senderId":"556","subject":"something", "message":"something"}' http://localhost:3000/messages/
app.post('/messages/', function (req, res) {

  // Read the body
  var propertyId = req.body.propertyId;
  var senderId = req.body.senderId;
  var subject = req.body.subject;
  var message = req.body.message;

  // Validate the user input
  if (propertyId === undefined || isNaN(propertyId) || isNaN(senderId))
  {
    res.status(400).send('Missing or incorrect Id(s)');
  }

  // Read the file per propertyId
  var filePath = './data/messages/property-' + propertyId + '.json';
  fs.readFile(filePath, 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading message or no such property.');
      }

      // Parse the data
      var obj = JSON.parse(data);

      // Add the new message
      obj.messages.message.push({senderId: senderId, subject: subject, message: message});

      // Save the file
      fs.writeFile(filePath, JSON.stringify(obj), function(err) {
          if(err) {
              return console.log(err);
          }

          res.json('{result: "Message updated."}');
      });
  });
});

// Bookings - Get by property
app.get('/bookings/:propertyId?/date/:date?', function (req, res) {
  // Check if we received a propertyId
  var propertyId = req.params.propertyId;
  if (propertyId === undefined)
  {
    res.status(400).send('Missing propertyId');
  }

  //  Check if want specific dates
  var returnAll = true;
  if (req.params.date){
    returnAll = false;
  }

  // Read the file per propertyId
  var filePath = './data/bookings/property-' + propertyId + '.json';
  fs.readFile(filePath, 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading bookings or no such property.');
      }

      console.log(date);

      // Parse the data
      var obj = JSON.parse(data);
      // if (returnAll){
        res.json(obj);
      // }
      // else{
      //   var bookings = obj.bookingSlots.booking;
      //   var result = [];
      //
      //   // Loop through the bookings and find any that match our date
      //   for (var i = 0; i < bookings.length; i++) {
      //     if (bookings[i].bookingDate == ){
      //       result.push(bookings[i]);
      //     }
      //   }
      //
      //   res.json(result);
      // }
  });
});

// Bookings - Create
// curl -X POST -H 'Content-Type: application/json' -d '{"propertyId":"1","bookingId":"556","bookingDate":"something", "bookerId":"something"}' http://localhost:3000/bookings/
app.post('/bookings/', function (req, res) {

  // Read the body
  var propertyId = req.body.propertyId;
  var bookingId = req.body.bookingId;
  var bookingDate = req.body.bookingDate;
  var bookerId = req.body.bookerId;

  // Validate the user input
  if (propertyId === undefined || isNaN(bookerId) || isNaN(bookingId))
  {
    res.status(400).send('Missing or incorrect Id(s)');
  }

  // Read the file per propertyId
  var filePath = './data/bookings/property-' + propertyId + '.json';
  fs.readFile(filePath, 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading bookings or no such property.');
      }

      // Parse the data
      var obj = JSON.parse(data);

      // Add the new booking
      obj.bookingSlots.booking.push({bookingId: bookingId, bookingDate: bookingDate, bookerId: bookerId});

      // Save the file
      fs.writeFile(filePath, JSON.stringify(obj), function(err) {
          if(err) {
              return console.log(err);
          }

          res.json('{result: "Booking updated."}');
      });
  });
});

// Properties - Get All
app.get('/properties/:propertyId?', function (req, res) {
  var returnAll = true;

  // Check if we received a propertyId
  var propertyId = req.params.propertyId;
  if (propertyId != undefined)
  {
    returnAll = false; // We should return a specific propertyId
  }

  fs.readFile('./data/properties.json', 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading properties.');
      }

      // Parse the data
      var obj = JSON.parse(data);

      // Do we want to return all records or only a specific property
      if (returnAll) {
          res.json(obj);
      }
      else {
        if (propertyId > 0) { propertyId = propertyId - 1; } // Zero based index
        res.json(obj.properties.property[propertyId]);
      }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
