# AGIW-Bing
A tool to help students with their second AGIW task.

## Config
Duplicate config.js.example and rename the copy config.js, then edit it
```javascript
module.exports = {
    matricola: 123456,
    cognome: "surname",
    apiKey: "1234IamNotaValidKey",
    filename: 'input/agiw-data-gathering-2016-2017-codes.txt',
    startingFrom: 12345,
    endingTo: 12445 // included
};
```
The interval from 'startingFrom' to 'endingTo' should be small. The script will do 3 queries for each record to give you 150 results. This means that you'll reach the requests/hour of your API Key and/or IP address very quickly.

I suggest little steps of an interval of max 100 values, every time logging possible failures as described in the instructions below. 

## Instructions
 * Install [Node.js](https://nodejs.org/) (you may need to restart).
 * Download this repository with the method you prefer. 
 * Open a terminal or cmd pointing inside the repository folder and type the following command:
 
 ```bash
 npm install
 ```
 
 * Once it's done you have to create a file called 'config.js' following the example given in 'config.js.example' (yes, you need a Bing Search API key, maybe from 2 different accounts).
 * Now to store the search results you need to type: 
 
 ```bash
 node bingSearch.js
 ```
 * Once you've run bingSearch.js in output folder you should have a file called 'results.txt' with all different results (if you did everything correctly with no repetitions) and as many files inputFileName_errors_X.txt as argMax for the errors that you can use as input (config.js -> filename) to try and get what you missed for each file.
 * As mentioned above, **if you fail all the requests in the current interval it means that you've reached your API limit or your request/minute limit**, so simply pause the work and try on the time that should appear in the logs (it's GMT). If you still fail all the requests try with another API key **from a different account**. 
 * failed_X.txt will have any query that has failed in bingSearch.js with X value, meaning that you can set it as input in config.js and try those queries again at the end.
 * Finally run: 
 
 ```bash
 node makeCsv.js > logsMake.txt
 ```
  This will create your surname.csv file in output/. 
 * Now just run:
 ```bash
  node getPages.js > logsGet.txt
 ```
 
 * NB: this may take a **very long time** to end since you'll probably going to have around 2 million web pages to download. You're free to use this if you want to check your progress on the terminal 
 
 ```bash
 node getPages.js 
 ```
 
 * Don't be afraid if the first results are all errors, it's normal since the requests run all in parallel and errors are faster.
 * You'll have all the files you need in the output folder and in htmlFiles folder (probably several thousands of html files and a csv file with your surname).
