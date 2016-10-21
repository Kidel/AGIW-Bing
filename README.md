# AGIW-Bing
A tool to help students with their second AGIW task (web scraping). 
It allows to search and download many keywords from Bing at once. 

## Config
Duplicate config.js.example and rename the copy config.js, then edit it
```javascript
module.exports = {
    matricola: 123456,
    cognome: "surname",
    apiKey: [
              "1234IamNotaValidKey",
              "1235IamNotAnotherApiKey",
              "1236IamReallyNotAnotherApiKey"
              ],
    filename: 'input/agiw-data-gathering-2016-2017-codes.txt',
    startingFrom: 1,
    endingTo: 500, // included
    results: 150,
    steps: 200,
    linearBackoff: 1000 * 60 * 10 // 10 minutes
};
```
Get your API keys from https://datamarket.azure.com/dataset/bing/search

In order to use more then one API key successfully they have to be from different accounts. 
Also be sure to manually generate your API key after you subscribe to Bing API, because the default one may give OAuth error. 

Regarding steps and linearBackoff, I suggest you don't go past 200 steps, and those require to wait 10 minutes (or Bing will gets mad at you). You can lower your consecutive steps if you have a poor internet connection and  you want to avoid timeout errors, in that case you can also lower your linearBackiff value. Just be sure to stay in the 200/10 step per minute.

## Instructions
 * Install [Node.js](https://nodejs.org/) (you may need to restart).
 * Download this repository with the method you prefer and make config.js following the example. 
 * Open a terminal or cmd pointing inside the repository folder and type the following command:
 
 ```bash
 npm install
 ```
 
 * Once it's done installing the required packages you have to store the search results, so just type: 
 
 ```bash
 node bingSearch.js
 ```
 * Time depends on your config, by default around 90 minutes for 1800 keywords to search. Once it's done you should have a file called 'results.txt' in the output folder, with all different results (if you did everything correctly with no repetitions) and as many files inputFileName_errors_X.txt as (results/50) for the errors (by default only 0, 1 and 2). If you have less then expected it may just mean you got no errors. 
 * You can use the error files as input to try and get what you missed simply by using 'user override mode' like that:
  ```bash
  node bingSearch.js X
  ```
   Where 'X' is the number of your error file (0 for XXX_error_0.txt, 1 for XXX_error_1.txt and so on). No need to move the log files to input. This may generate new error files with '_new' before the extension (if you still get errors in '_new' log files just rename them removing '_new' and retry user override with the corresponding number).
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
 
 * NB: this may take a **very long time** depending on your connection speed and cpu (took me 4 hours with i7 and 30 Mb/s connection) to end since you're probably going to have around 2 million web pages to download. You're free to use this if you want to check your progress on the terminal 
 
 ```bash
 node getPages.js 
 ```
 
 * Don't be afraid if the first results are all errors, it's normal since the requests run all in parallel and errors are faster.
 * You'll have all the files you need in the output/ folder and in htmlFiles/ folder (probably several thousands of html files and a csv file with your surname).

Have fun and report issues.


## Troubleshooting
 * If you get `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory` 
   during getPages.js, try running it as shown below:
 
 ```bash
 node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096 --stack_size=4096 getPages.js >> logsGet.txt
 ```
 * Also you can make a backup copy of your surname.csv and delete the pages you already downloaded from the surname.csv you leave in the output folder, so the program will resume download from where it left. 
 * If after many hours the execution has not ended but it's not even using CPU and Internet, it probably means it has ended. Check your last entry in the surname.csv file and see if that page has been downloaded to htmlFiles folder. If it's not a 0 byte file, then you can simply close the terminal to stop the execution. 
