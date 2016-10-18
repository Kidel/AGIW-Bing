var config = require('./config');

var fs = require('graceful-fs');
var path = require('path');

var counter = [];

var arg;
try {
    arg = process.argv.slice(2)[0] * 1;
}
catch(e) {
    arg = -1;
}

var errorFileName = "output/"+path.basename(config.filename, '.txt')+"_error_";

var argMax = Math.ceil(config.results / 50);

var start = config.startingFrom;
var end = (config.startingFrom + config.steps <= config.endingTo)? (config.startingFrom + config.steps):config.endingTo;

function updateStartEnd(oldEnd) {
    start = oldEnd+1;
    end = (oldEnd+1 + config.steps <= config.endingTo)? (oldEnd+1 + config.steps):config.endingTo;
}

// main
var linearBackoff = setInterval(function () {
    mainTask(start, end);
    updateStartEnd(end);
}, config.linearBackoff);


function mainTask(start, end) {
    if (arg != -1) {
        if (config.apiKey.length >= (argMax + 1)) {
            getDataFromBing(config.apiKey, 0, start, end);
        }
        else
            console.log("Not enough Bing API keys, insert more in config.js");
    }
    else { // user override if script is launched with 1 argument
        if (arg <= config.apiKey.length) {
            argMax = arg;
            getDataFromBing([config.apiKey[arg]], arg, start, end);
        }
        else
            console.log("Argument " + arg + " is not valid");
    }
}

function getDataFromBing(apiKey, arg, start, end){

    var Bing = require('node-bing-api')({ accKey: apiKey[arg] });
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(config.filename)
    });

    lineReader.on('line', function (line) {
        var lineArray = line.split("\t");
        var code = lineArray[0] * 1;
        
        if(code>=start && code<=end) {
            var query = lineArray[1].replace(/(\r\n|\n|\r)/gm,"");
            Bing.web(query, {
                top: 50,  // Number of results (max 50)
                skip: 50 * arg,   // Skip first x results
                options: ['DisableLocationDetection', 'EnableHighlighting']
            }, function (error, res, body) {
                counter[arg] = counter[arg]+1 || 1;
                if(typeof res != 'undefined' && res.statusCode == "503") {
                    var message = code + "\t" + query + "\t" + arg + "\t ERR:SUBLIMIT " + res.statusMessage.replace(/(\r\n|\n|\r)/gm,"")+"\n";
                    fs.appendFile(errorFileName+arg+".txt", message, function (err) {
                        if (err){
                            console.log('Damn, I can\'t event write on a file');
                        }
                    });
                    return;
                }

                if (!error) {
                    if (typeof body != 'undefined') {
                        var print = JSON.stringify(body.d.results, null, 4);
                        //console.log(code + " query " + query + " has given " + body.d.results.length + " results");
                        fs.appendFile('output/results.txt', print, function (err) {
                            if (err) {
                                var message = code + "\t" + query + "\t" + arg + "\t FS error " + err + "\n";
                                fs.appendFile(errorFileName+arg+".txt", message, function (err) {
                                    if (err){
                                        console.log('Damn, I can\'t event write on a file');
                                    }
                                }); 
                            }
                        });
                    }
                    else {
                        // 0 results
                    }
                }
                else {
                    // bing errors like timeout
                    var message = code + "\t" + query + "\t" + arg + "\t Bing API error " + error+"\n";
                    fs.appendFile(errorFileName+arg+".txt", message, function (err) {
                        if (err){
                            console.log('Damn, I can\'t event write on a file');
                        }
                    });
                }
                findEnd(counter);
            });
        } else {
            if(code==(config.endingTo+1)){
                if(arg<argMax){
                    getDataFromBing(apiKey, (arg+1), start, end);
                }
            }
        }
    });
}

function findEnd(contatore){
    if(contatore.every(isEnded)){
        console.log("I've finished the first " + config.steps + " steps, waiting " + (config.linearBackoff / 1000) + " seconds now");
        if(end >= config.endingTo) {
            clearInterval(linearBackoff);
            console.log("everything done");
        }
    }
}

function isEnded(element, index, array) {
  return element == ((start-end)+1);
}