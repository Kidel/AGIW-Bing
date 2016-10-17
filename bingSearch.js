var config = require('./config');

var fs = require('fs');

var argMax = config.argMax;
if(config.apiKey.length >= (argMax+1)){
    getDataFromBing(config.apiKey,0);
} else {
    console.log("Not enough api keys");
}


function getDataFromBing(apiKey, arg){

    var Bing = require('node-bing-api')({ accKey: apiKey[arg] });
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(config.filename)
    });

    lineReader.on('line', function (line) {
        var lineArray = line.split("\t");
        var code = lineArray[0] * 1;
        
        if(code>=config.startingFrom && code<=config.endingTo) {
            var query = lineArray[1].replace(/(\r\n|\n|\r)/gm,"");
                Bing.web(query, {
                    top: 50,  // Number of results (max 50)
                    skip: 50 * arg,   // Skip first x results
                    options: ['DisableLocationDetection', 'EnableHighlighting']
                }, function (error, res, body) {

                    if(typeof res != 'undefined' && res.statusCode == "503") {
                        console.log(code + "\t" + query + "\t ERR:SUBLIMIT " + res.statusMessage.replace(/(\r\n|\n|\r)/gm,""));
                        return;
                    }

                    if (!error) {
                        if (typeof body != 'undefined') {
                            var print = JSON.stringify(body.d.results, null, 4);
                            //console.log(code + " query " + query + " has given " + body.d.results.length + " results");
                            fs.appendFile('output/results.txt', print, function (err) {
                                if (err) {
                                    console.log(code + "\t" + query + "\t FS error " + err);
                                }
                            });
                        }
                        else {
                            // 0 results
                        }
                    }
                    else {
                        // bing errors like timeout
                        console.log(code + "\t" + query + "\t Bing API error " + error);
                    }
                });
        } else {
            if(code==(config.endingTo+1)){
                if(arg<argMax){
                    console.log("Token! Changing API key to " + arg);
                    getDataFromBing(apiKey, (arg+1)); 
                } 
            }
        }
    });
}