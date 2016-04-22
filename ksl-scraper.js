/****************************************************************
Hey Rion,

If you could do this "assignment", that'd be awesome.

As a dev it's important to be able to learn new libraries and technologies as you come across problems.

The "situation":
- You're at home and realize you need a new laptop.
- You hate looking in the classifieds section at every ad and are pretty sure what you want based on a few key words.

Using CasperJS. Create a "web scraper" that can write to a local file of listings that pass the "filter":
- of being a Macbook pro,
- priced between 800 and 1000 dollars.
- Also it must have at least 256 GB of HD space.

Ideally you'd want to have a 'cron job' of executing this script every hour to stay updated on new listings posted.

Have fun with it and hopefully it's something that you can use in the future to benefit you.
Use any classifieds web page service you like. Personally I'd use KSL.
Keep in mind that I don't care about the specifics of how you implement it.
Mostly I just want to see you learn a new technology, figure out what you need to know to solve a problem.
I'll also be curious about considerations and any edge cases you take into account.
Google is your friend and remember to have fun!
*****************************************************************/

// initiate casper instance, pass in option variables
var casper = require("casper").create({
  verbose: true,
  logLevel: 'error',     // debug, info, warning, error
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
  clientScripts: ["vendor/jquery.js", "vendor/lodash.js"]
});

// define variables
var fs = require('fs');
var url = 'http://www.ksl.com/?nid=231&sid=74268&cat=215&search=macbook+pro&zip=Enter+Zip+Code&distance=&min_price=800&max_price=1000&type=&category=16&subcat=&sold=&city=&addisplay=&sort=1&userid=&markettype=sale&adsstate=&nocache=1&o_facetSelected=&o_facetKey=&o_facetVal=&viewSelect=list&viewNumResults=12&sort=1';
var listings = [];
var prices = [];
var output = [];

// declare function that gets list of computers from DOM
function getComputers() {
  var computers = $('.adTitle a');
  return _.map(computers, function(e){
    return e.innerHTML;
  });
};

// declare function that outputs results in JSON format
function outputJSON() {
  console.log("in outputJSON");
  console.log(computers);
  output.push({
    computers : computers,
    // link: link,
    // title: title,
    // date: date
  });
  return JSON.stringify(output);
};

// start casper
casper.start(url, function() {
  this.echo(this.getTitle());
});

// wait in case we need page to load first
casper.wait(1000, function() {
  console.log('waited 1 second');
});

// get list computers (calls getComputers)
casper.then(function() {
  computers = this.evaluate(getComputers);
});

// print out results to console
casper.then(function() {
  this.echo(computers.length + ' computers found: ');
  this.echo(' - ' + computers.join('\n - ')).exit();
});

// write file with results
casper.run(function() {
  console.log("in run callback");
  console.log("computers: " + computers);

  console.log("data, before outputJSON call..." + data);
  var data = outputJSON();
  console.log("data, after outputJSON call..." + data);    

  fs.write('data.json', data, 'w');
  this.echo("\n Execution terminated").exit();
});
