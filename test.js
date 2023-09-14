const fs = require("fs"),
      csv = require("csv-stringify");

// (B) DATA TO WRITE
var data = [
  ["Apple", "Banana"],
  ["Cherry", "Durian"],
  ["Elderberry", "Fig"]
];

// (C) CREATE CSV FILE
csv.stringify(data, (err, output) => {
  fs.writeFileSync("demoA.csv", output);
  console.log("OK");
});