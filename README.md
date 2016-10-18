# AGIW-Bing
A tool to help students with their second AGIW task.

## Config
Duplicate config.js.example and rename the copy config.js, then edit it
```javascript
module.exports = {
    matricola: 123456,
    cognome: "surname",
    apiKey: [
              "1234IamNotaValidKey",
              "1235IamNotAnotherApiKey",
              "1236IamNotAnotherApiKey"
              ],
    filename: 'input/agiw-data-gathering-2016-2017-codes.txt',
    startingFrom: 1,
    endingTo: 500, // included
    results: 150,
    steps: 200,
    linearBackoff: 1000 * 60 * 10 // 10 minutes
};
```
I suggest little steps of an interval of max 200 values, every and check for possible failures.

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
 * Once you've run bingSearch.js in output folder you should have a file called 'results.txt' with all different results (if you did everything correctly with no repetitions) and as many files inputFileName_errors_X.txt as results/50 for the errors. 
 * You can use as the error files as input to try and get what you missed for each file simply by using user override mode like that:
  ```bash
  node bingSearch.js X
  ```
   Where 'X' is the number of your error file (0 for XXX_error_0.txt, 1 for XXX_error_1.txt and so on). 
 * The script will automatically try a linear backoff waiting (by default) 10 minutes every 200 API uses. By the way **keep checking your log files to see if your keys have expired**.  It should take about 90 minutes for 1800 keywords (with default settings).
 * When you're confident about your output/results.txt (the file that stores the results) run the following:
 
 ```bash
 node makeCsv.js > logsMake.txt
 ```
  This will create your surname.csv file in output/. 
 * Now finally run:
 
 ```bash
  node getPages.js > logsGet.txt
 ```
 
 * NB: this may take a **very long time** depending on your connection speed and cpu (took me 4 hours with i7 and 30 Mb/s connection) to end since you'll probably going to have around 2 million web pages to download. You're free to use this if you want to check your progress on the terminal 
 
 ```bash
 node getPages.js 
 ```
 
 * Don't be afraid if the first results are all errors, it's normal since the requests run all in parallel and errors are faster.
 * You'll have all the files you need in the output/ folder and in htmlFiles/ folder (probably several thousands of html files and a csv file with your surname).

Have fun and report issues.