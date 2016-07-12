var express = require('express');
var app = express();
var fs = require('fs');

// Properties - Get All
app.get('/properties/', function (req, res) {
  fs.readFile('./data/properties.json', 'utf8', function (err, data) {
      // Did anything go wrong?
      if (err) {
        res.status(500).send('Error reading properties.');
      }

      // Parse the data
      var obj = JSON.parse(data);
      res.send(obj);
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
      res.send(obj);
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
      res.send(obj);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
