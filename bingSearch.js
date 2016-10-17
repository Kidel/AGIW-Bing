var config = require('./config');

var fs = require('graceful-fs');
var Bing = require('node-bing-api')({ accKey: config.apiKey });
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(config.filename)
});

lineReader.on('line', function (line) {
    var code = line.split("\t")[0] * 1;
    var query = line.split("\t")[1];
    if(code>=config.startingFrom && code<=config.endingTo) {
        //console.log(code, query);
        for(var i = 0; i<=2; i++) {
            var first = 0;
            Bing.web(query, {
                top: 50,  // Number of results (max 50)
                skip: 50 * i,   // Skip first x results
                options: ['DisableLocationDetection', 'EnableHighlighting']
            }, function (error, res, body) {
                var print = JSON.stringify(body.d.results, null, 4);
                fs.appendFile('output/results.txt', print, function (err) {
                    if (err) return console.log(err);
                });
            });
        }
    }
});

