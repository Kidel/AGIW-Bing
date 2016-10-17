var config = require('./config');

var fs = require('graceful-fs');
var Bing = require('node-bing-api')({ accKey: config.apiKey });
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(config.filename)
});

var attempts = [0, 1, 2];

var failed = "";

lineReader.on('line', function (line) {
    var code = line.split("\t")[0] * 1;
    var query = line.split("\t")[1];
    if(code>=config.startingFrom && code<=config.endingTo) {
        //console.log(code, query);
        attempts.forEach(function(i) {
            var first = 0;
            Bing.web(query, {
                top: 50,  // Number of results (max 50)
                skip: 50 * i,   // Skip first x results
                options: ['DisableLocationDetection', 'EnableHighlighting']
            }, function (error, res, body) {
                if(!error) {
                    if(typeof body != 'undefined') {
                        var print = JSON.stringify(body.d.results, null, 4);
                        console.log(code + " query " + query + " has given " + body.d.results.length + " results");
                        fs.appendFile('output/results.txt', print, function (err) {
                            if (err) return console.log(err);
                        });
                    }
                    else {
                        console.log(code + " query " + query + " has given no results");
                        failed = failed + code + "\t" + query + "\n";
                    }
                }
                else {
                    console.log(code + " query " + query + " has given error " + error);
                    failed = failed + code + "\t" + query + "\n";
                }
            });
        });
    }
});

lineReader.on('end', function () {
    fs.appendFile('input/failedQueries.txt', failed, function (err) {
        if (err) return console.log(err);
    });
});