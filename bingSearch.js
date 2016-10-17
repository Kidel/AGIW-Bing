var config = require('./config');

var fs = require('fs');
var Bing = require('node-bing-api')({ accKey: config.apiKey });
var lineReader = require('readline').createInterface({
    input: fs.createReadStream(config.filename)
});

var arg
try {
    arg = process.argv.slice(2)[0] * 1;
}
catch(e) {
    arg = 0;
}
var subEnd = false;

lineReader.on('line', function (line) {
    var code = line.split("\t")[0] * 1;
    var query = line.split("\t")[1].replace(/(\r\n|\n|\r)/gm,"");
    if(code>=config.startingFrom && code<=config.endingTo) {
        if(!subEnd)
            Bing.web(query, {
                top: 50,  // Number of results (max 50)
                skip: 50 * arg,   // Skip first x results
                options: ['DisableLocationDetection', 'EnableHighlighting']
            }, function (error, res, body) {

                if(typeof res != 'undefined' && res.statusCode == "503") {
                    console.log(code + "\t" + query + "\t ERR:SUBLIMIT " + res.statusMessage.replace(/(\r\n|\n|\r)/gm,""));
                    subEnd = true;
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
                        return false;
                    }
                }
                else {
                    // bing errors like timeout
                    console.log(code + "\t" + query + "\t Bing API error " + error);
                }
            });
    }
});