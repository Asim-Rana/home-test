var http = require('http');
var url = require('url');
var cheerio = require('cheerio');
var express = require('express');

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
        res.json({ message: queryStringParams.address });
    } else {
        res.json('no address passed in query string "address"');
    }
});

app.use('/api', router);

app.listen(port);

console.log('Server is running on: ' + port);

