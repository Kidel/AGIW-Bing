var config = require('./config');

var fs = require('graceful-fs');
var Bing = require('node-bing-api')({ accKey: config.apiKey });
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(config.filename)
});

var attempts = [0, 1, 2];
var fail = [];
var skip =[];
var succ =[];

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

lineReader.on('line', function (line) {
    var code = line.split("\t")[0] * 1;
    var query = line.split("\t")[1];
    if(code>=config.startingFrom && code<=config.endingTo) {
        //console.log(code, query);
        attempts.every(function(i) {
            if(typeof skip[code] == 'undefined')
                Bing.web(query, {
                    top: 50,  // Number of results (max 50)
                    skip: 50 * i,   // Skip first x results
                    options: ['DisableLocationDetection', 'EnableHighlighting']
                }, function (error, res, body) {
                    if(!error) {
                        if(typeof body != 'undefined') {
                            var print = JSON.stringify(body.d.results, null, 4);
                            //console.log(code + " query " + query + " has given " + body.d.results.length + " results");
                            fs.appendFile('output/results.txt', print, function (err) {
                                if (err) {
                                    if(typeof fail[code] == 'undefined' && typeof succ[code] == 'undefined')
                                        fail[code] = query;
                                    //console.log(code + "\t" + query);
                                    //throw new FsException("FS " + err);
                                }
                                else succ[code] = query;
                            });
                        }
                        else {
                            skip[code] = query;
                            succ[code] = query;
                            //throw new BingException("" + code + " query " + query + " has given no results");
                        }
                    }
                    else {
                        if(typeof fail[code] == 'undefined' && typeof succ[code] == 'undefined')
                            fail[code] = query;
                        //throw new BingException("" +code + " query " + query + " has given error " + error);
                    }
                });
        });
    }
});

lineReader.on('close', function() {
    sleep(1000 * ((config.endingTo-config.startingFrom)/30), function() {
        for(var code in fail) {
            console.log(code + "\t" + fail[code]);
        }
    });
});