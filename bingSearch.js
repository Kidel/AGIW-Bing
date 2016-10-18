var config = require('./config');

var fs = require('graceful-fs');
var path = require('path');
var rl = require('readline');
var b = require('node-bing-api');

var counter = [];

var arg;
try {
    arg = process.argv.slice(2)[0] * 1;
    if(isNaN(arg)) throw "NaN";
}
catch(e) {
    arg = -1;
}
if(arg != -1) console.log("User requested procedure override with arg: " + arg);
else console.log("Reading file " + config.filename);

var errorFileName = "output/"+path.basename(config.filename, '.txt')+"_error_";

var argMax = Math.ceil(config.results / 50) -1;

var start = config.startingFrom;
var end = (config.startingFrom + config.steps <= config.endingTo)? (config.startingFrom + config.steps):config.endingTo;

if (arg == -1) {
    mainTask(start, end);

    var linearBackoff = setInterval(function () {
        console.log("Started Linear Backoff");
        updateStartEnd(end);
        mainTask(start, end);
    }, config.linearBackoff);

    function updateStartEnd(oldEnd) {
        start = oldEnd + 1;
        end = (oldEnd + 1 + config.steps <= config.endingTo) ? (oldEnd + 1 + config.steps) : config.endingTo;
        counter = [];
        console.log("Recalculating start: " + start + " and end: " + end);
    }
}
else mainTask(config.startingFrom, config.endingTo);

function mainTask(start, end) {
    if (arg == -1) {
        if (config.apiKey.length >= (argMax + 1)) {
            getDataFromBing(config.apiKey, 0, start, end, config.filename, "");
        }
        else
            console.log("Not enough Bing API keys, insert more in config.js");
    }
    else { // user override if script is launched with 1 argument
        if (arg <= config.apiKey.length) {
            console.log("User override accepted");
            console.log("New logs will be saved to " + errorFileName+arg+"_new"+".txt");
            argMax = arg;
            getDataFromBing(config.apiKey, arg, config.startingFrom, config.endingTo, errorFileName +arg+".txt", "_new");
        }
        else
            console.log("Argument " + arg + " is not valid");
    }
}

function getDataFromBing(apiKey, offset, start, end, filename, discriminator){
    var Bing = b({ accKey: apiKey[offset] });
    var lineReader = rl.createInterface({
        input: fs.createReadStream(filename)
    });

    lineReader.on('line', function (line) {
        var lineArray = line.split("\t");
        var code = lineArray[0] * 1;

        if(code>=start && code<=end) {
            var query = lineArray[1].replace(/(\r\n|\n|\r)/gm,"");
            Bing.web(query, {
                top: 50,  // Number of results (max 50)
                skip: 50 * offset,   // Skip first x results
                options: ['DisableLocationDetection', 'EnableHighlighting']
            }, function (error, res, body) {
                counter[offset] = counter[offset]+1 || 1;
                if(typeof res != 'undefined' && res.statusCode == "503") {
                    var message = code + "\t" + query + "\t" + offset + "\t ERR:SUBLIMIT " + res.statusMessage.replace(/(\r\n|\n|\r)/gm,"")+"\n";
                    fs.appendFile(errorFileName+offset+discriminator+".txt", message, function (err) {
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
                                var message_1 = code + "\t" + query + "\t" + offset + "\t FS error " + err + "\n";
                                fs.appendFile(errorFileName+offset+discriminator+".txt", message_1, function (err) {
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
                    var message_2 = code + "\t" + query + "\t" + offset + "\t Bing API error " + error+"\n";
                    fs.appendFile(errorFileName+offset+discriminator+".txt", message_2, function (err) {
                        if (err){
                            console.log('Damn, I can\'t event write on a file');
                        }
                    });
                }
                findEnd(counter);
            });
        } else {
            if(code==(config.endingTo+1)){
                if(offset<argMax){
                    getDataFromBing(apiKey, (offset+1), start, end, filename, discriminator);
                }
            }
        }
    });
}

function findEnd(contatore){
    if(contatore.every(isEnded)){
        console.log("I've finished " + ((arg==-1)? config.steps:contatore[arg]) + " steps ");
        if(arg == -1)
            console.log("Waiting " + (config.linearBackoff / 1000) + " seconds now");
        if(end >= config.endingTo) {
            clearInterval(linearBackoff);
            console.log("Everything done, check your error log files. Wait 10 minutes and retry to download using override (passing the error log file number as parameter)");
        }
    }
}

function isEnded(element, index, array){
    if (arg == -1)
        return element == ((end-start)+1);
    else
        return element == ((config.endingTo-config.startingFrom)+1);
}