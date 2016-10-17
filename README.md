# AGIW-Bing
A tool to help students with their second AGIW homework.

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
 node bingSearch.js > logsSearch.txt
 ```
 * If your interval contains more the 1500 codes I recommend splitting it into 2 intervals and run  bingSearch.js 2 times with 2 Bing Accounts and the 2 intervals (free API accounts only have 5000 free transactions, and to get 150 results the software needs to do 3 of them for each record, since the API is limited to 50 max results for 1 query).
 * Once you've run bingSearch.js as many times as you want with different intervals you should have a file called 'output/results.txt' with all the results (if you did everything correctly with no repetitions).
 * Finally run: 
 ```
 node getAndCsv.js > logsGet.txt
 ```
 * NB: this may take a very long time to end since you'll probably going to have around 800.000 web pages to download. 
 * You'll have all the files you need in the output folder and in logsGet.txt and logsSearch.txt.
