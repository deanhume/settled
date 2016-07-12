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


// Properties - Get All
app.get('/properties/', function (req, res) {
  fs.readFile('./data/properties.json', 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading properties.');
      }

      // Parse the data
      var obj = JSON.parse(data);
      res.json(obj);
  });
});

// Messages - Get by property
app.get('/messages/:propertyId', function (req, res) {
  // Check if we received a propertyId
  var propertyId = req.params.propertyId;
  if (propertyId === undefined)
  {
    res.status(400).send('Missing propertyId');
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
      res.json(obj);
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
app.get('/bookings/:propertyId', function (req, res) {
  // Check if we received a propertyId
  var propertyId = req.params.propertyId;
  if (propertyId === undefined)
  {
    res.status(400).send('Missing propertyId');
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
      res.json(obj);
  });
});

// Bookings - Create
//curl -X POST -H 'Content-Type: application/json' -d '{"propertyId":"1","bookingId":"556","bookingDate":"something", "bookerId":"something"}' http://localhost:3000/bookings/
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
