const csv = require("csv-stringify");
const https = require('https');
const conf = require('../config/config');
const fs = require("fs")


let csvFile = [
  ['Pricing Zone', 'Competition Group']
]

const getPricingZones = () => executeRequest('https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones')
const getCompetitionGroups = () => executeRequest('https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones/414/competition-groups')

createCsvFile()

function createCsvFile() {
  // return the response
  getPricingZones().then(res => {
    let pricingZones = res.data

    pricingZones.forEach(pricingZone => {
      let pricingZoneName = pricingZone.description
      let countries = pricingZone.countries.map(e => e.iso2Code).join(", ")
      let outputRow = `${pricingZoneName} (${countries})`
      csvFile.push([outputRow])
    });

    return getCompetitionGroups();
  })
    .then(res => {
      let cg = res.data
      cg.forEach(e => {
        let map = e.competitions.map(c => c.name).join("\n ")
        let outputRow = `${e.description} (${map})`
        csvFile.push(['Test', map])
        csv.stringify(csvFile, (err, output) => {
          fs.writeFileSync("../generatedFiles/csp.csv", output);
          console.log("OK");
        });
      })

    })
    .catch(err => {
      throw new Error("Failed to complete", err)
    })
}

function executeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let data = "";

      // A chunk of data has been recieved.
      res.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      res.on("end", () => {
        resolve(JSON.parse(data))
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.end();
    });
  })
}