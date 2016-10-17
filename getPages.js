var config = require('./config');

var fs = require('graceful-fs');
var request = require('request');

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('output/' + config.cognome + '.csv')
});

lineReader.on('line', function (line) {
	var lineArr = line.split(";");
    var query = lineArr[0];
    var filename = 'htmlFiles/' + lineArr[1];
	var url = lineArr[2];
    try {
		var file = fs.createWriteStream(filename);
		request.get(url).on('error', function (e) {
			console.log("HTTP error getting query result for " + query + " url " + url + " ---- " + e.message);
		}).pipe(file).on('close', function () {
			console.log("Ok on file "+ filename +", query result for " + query + " url " + url);
		});
	}
	catch(e) {
		console.log("Got error for file " + filename + ": " + e.message);
	}
});