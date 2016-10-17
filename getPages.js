var config = require('./config');

var fs = require('graceful-fs');
var request = require('request');

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('output/' + config.cognome + '.csv')
});

function savePage(data, filename) {
    fs.writeFile(filename, data, function (err) {
        if (err) {
            console.log("FS ERROR for file " + filename + ": " + e.message);
        }
        else console.log("OK FS file " + filename + "written correctly");
        data = null;
    });
}

lineReader.on('line', function (line) {
    var lineArr = line.split(";");
    var query = lineArr[0];
    var filename = 'htmlFiles/' + lineArr[1];
    var url = lineArr[2];
    try {
        var options = {
            url: url,
            method: 'GET',
            "rejectUnauthorized": false,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
            }
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("OK HTTP got data for " + url);
                savePage(body, filename);
            }
            else console.log("HTTP ERROR: " + ((typeof response != 'undefined')? response.statusCode:'?') + " --- " + error + " on url " + url);
            response = null;
        })
    }
    catch(e) {
        console.log("ERROR: " + e.message);
    }
});