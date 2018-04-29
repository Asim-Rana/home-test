var cheerio = require('cheerio');
var express = require('express');
var request = require('request');
var async = require('async');

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

        async.eachSeries(addresses, function(address, callback){

            var addressFromQueryString = address;

            if ( !address.startsWith('https://') && !address.startsWith('http://') ) {
                address = 'http://' + address;
            }

            request(address, function (error, response, body) {
                if(!error){
                    addTitleInResponse(addressFromQueryString, body);
                } else {
                    addTitleInResponse(addressFromQueryString);
                }
                callback();
            });

        }, function() {
            htmlResponse = htmlResponse + '</ul></body></html>';
            res.end(htmlResponse);
        });

        var addTitleInResponse = function(address, response) {

            if (response) {
                $ = cheerio.load(response);
                htmlResponse = htmlResponse + '<li> ' + address + ' - "' + $('title').text() + '" </li>';
            }
            else {
                htmlResponse = htmlResponse + '<li> ' + address + ' - NO RESPONSE </li>';
            }
        };
    } else {
        res.json('no address passed in query string "address"');
    }
});

app.use('/api', router);

app.listen(port);

console.log('Server is running on: ' + port);

