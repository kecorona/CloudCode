// Include Cloud Code module dependencies
var express = require('express'),
    twilio = require('twilio');

// Create an Express web app (more info: http://expressjs.com/)
var app = express();

// Create a route that will respond to am HTTP GET request with some
// simple TwiML instructions
app.get('/hello', function(request, response) {
    // Create a TwiML response generator object
    var twiml = new twilio.TwimlResponse();

    // add some instructions
    twiml.say('Hello there! Isn\'t Parse cool?', {
        voice:'woman'
    });

    // Render the TwiML XML document
    response.type('text/xml');
    response.send(twiml.toString());
});

// Start the Express app
app.listen();

// Use Parse's RPC functionality to make an outbound call
Parse.Cloud.define('makeCall', function(request, response) {
    // Create a Twilio REST API client - get your account SID and
    // auth token at https://www.twilio.com/user/account
    var client = new twilio.RestClient(
        'PN8bd26586217afc56f80cde9a9a2275b7', // Account SID
        'f1bb771c346eafb5376009f7ea0e5c37' // auth token
    );
 
    // Place an outbound call
    client.makeCall({
        to: request.params.to, // the number you wish to call
        from: '+14844027237', // a valid Twilio number you own
        url: 'https://projectcochran.parseapp.com/hello', // TwiML URL
        method: 'GET' // HTTP method with which to fetch the TwiML
    }, function(error, data) {
        // Handle the result of placing the outbound call
        if (error) {
            response.error('There was a problem :(');
        } else {
            response.success('Incoming Call');
        }
    });
});