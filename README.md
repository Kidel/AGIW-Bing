# AGIW-Bing
A tool to help students with their second AGIW homework.

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

I suggest little steps of an interval of max 100 values, every time logging possible failures as descriped in the instructions below. 

## Instructions
 * Install [Node.js](https://nodejs.org/) (you may need to restart).
 * Download this repository with the method you prefer. 
 * Open a terminal or cmd pointing inside the repository folder and type the following command:
 ```
 npm install
 ```
 * Once it's done you have to create a file called 'config.js' following the example given in 'config.js.example' (yes, you need a Bing Search API key, maybe from 2 different accounts).
 * Now to store the search results you need to type: 
 ```
 node bingSearch.js > failed_X.txt
 ```
 * Replace "X" in the command with a different number each time you run bingSearch.js on a different interval, so that you can keep track of all the queries that Bing fails or refuses to reply to.
 * If your given interval contains more the 1500 codes I recommend splitting it into 15 intervals and run  bingSearch.js 15 times with at least 2 Bing Accounts (free API accounts only have 5000 free transactions, and to get 150 results the software needs to do 3 of them for each record, since the API is limited to 50 max results for 1 query).
 * Once you've run bingSearch.js as many times as you want with different intervals you should have a file called 'output/results.txt' with all different results (if you did everything correctly with no repetitions) and many (many) failed_XY.txt files. You can merge all those fail files into a new one and use it as input (config.js -> filename) to try and get what you missed. 
 * As mentioned above, **if you fail all the requests in your interval it means that you've reached your API limit or your IP limit**, so simply pause the work and try another day or in a few hours. If you still fail all the requests try with another API key **from a different account**. 
 * Finally run: 
 ```
 node getAndCsv.js > logsGet.txt
 ```
 * NB: this may take a **very (very) long time** to end since you'll probably going to have around 800.000 web pages to download. You're free to use only 
 ```
 node getAndCsv.js
 ```
 (without the log file) if you want to check your progress on the terminal (don't be afraid if the first results are all errors, it's normal since the requests run all in parallel and errors are faster).
 * You'll have all the files you need in the output folder and in logsGet.txt (probably several thousands of html files and a csv file with your surname).
 * failed.txt will have any query that has failed in bingSearch.js, meaning that you can rename it set it as input in config.js.
