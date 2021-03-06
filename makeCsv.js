var config = require('./config');

var fs = require('graceful-fs');
var request = require('request');
var csvWriter = require('csv-write-stream');

var writer = csvWriter({separator: ';', sendHeaders: false});
var incremental = 0;

writer.pipe(fs.createWriteStream('output/' + config.cognome + '.csv'));

fs.readFile('output/results.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var data = JSON.parse(data.replace(/\[\]/gi, "").replace(/\]\[/gi, ","));
    //console.log(data);
    data.forEach(function(d, i) {
        var code = d.__metadata.uri.split("Query='")[1].split("'")[0].replace(/(\r\n|\n|\r)/gm,"");
        var url = d.Url;
        incremental++;
        try {
            //console.log({query: code, filename: config.matricola + "-" + incremental + ".html", url: url})
            writer.write({query: code, filename: config.matricola + "-" + incremental + ".html", url: url});
        }
        catch(e) {
            console.log("Got error: " + e.message);
        }
        // all done
        if(i >= data.length - 1) writer.end();
    });
});
