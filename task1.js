var cheerio = require('cheerio');
var express = require('express');
var request = require('request');

var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();


router.get('/I/want/title', function(req, res) {
    var queryStringParams = req.query;
    if(queryStringParams.address) {

        var addresses = queryStringParams.address;

        if ( !Array.isArray(addresses) ) {
            addresses = [addresses];
        }
        var htmlResponse = '<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>';

        var addTitleInResponse = function(addresses, index, response) {

            if (response) {
                $ = cheerio.load(response);
                htmlResponse = htmlResponse + '<li> ' + addresses[index] + ' - "' + $('title').text() + '" </li>';
            }
            else {
                htmlResponse = htmlResponse + '<li> ' + addresses[index] + ' - NO RESPONSE </li>';
            }

            if ( index < addresses.length - 1 ) {
                makeHttpRequests(addresses, addTitleInResponse, index+1);
            }
            else {
                htmlResponse = htmlResponse + '</ul></body></html>';
                res.end(htmlResponse);
            }
        };

        function makeHttpRequests(addresses, addTitleInResponse, index) {
            var address = addresses[index];
            if ( !address.startsWith('https://') && !address.startsWith('http://') ) {
                address = 'http://' + address;
            }

            request(address, function (error, response, body) {
                if(!error){
                    addTitleInResponse(addresses, index, body);
                } else {
                    addTitleInResponse(addresses, index);
                }
            });
        }

        makeHttpRequests(addresses, addTitleInResponse, 0);
    } else {
        res.json('no address passed in query string "address"');
    }
});

app.use('/api', router);

app.listen(port);

console.log('Server is running on: ' + port);

