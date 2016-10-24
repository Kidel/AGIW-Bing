var config = require('./config');

var fs = require('graceful-fs');
var request = require('request');

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('output/' + config.cognome + '.csv')
});

var contatoreDiversi = 0;
var contati = [];

lineReader.on('line', function (line) {
    var lineArr = line.split(";");
    var url = lineArr[2];
	var urlBase = url.split("://")[1].split("/")[0];
	if(typeof contati[urlBase] == 'undefined' || contati[urlBase] !== true) {
		contatoreDiversi++;
		contati[urlBase] = true;
	}
	console.log(contatoreDiversi);
});


	