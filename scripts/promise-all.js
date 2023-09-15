const csv = require("csv-stringify");
const https = require('https');
const conf = require('../config/config');
const fs = require("fs")
const Promise = require('bluebird');



let csvFile = [
  ['Pricing Zone', 'Competition Group']
]

const getPricingZones = () => executeRequest('https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones')
const getCompetitionGroups = (id) => executeRequest(`https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones/${id}/competition-groups`)

createCsvFile()

function createCsvFile() {
  // return the response
  getPricingZones().then(res => {
    let pricingZones = res.data

    Promise.map(pricingZones, function (pricingZone) {
      // Promise.map awaits for returned promises as well.
      return getCompetitionGroups(pricingZone.id)
        .then(competitionGroups => {
          return { pricingZone, competitionGroups }
        });
    }).then(function (res) {
      res.forEach(data => {
        let { pricingZone, competitionGroups } = data

        let pricingZoneName = pricingZone.description
        let countries = pricingZone.countries.map(e => e.iso2Code).join(", ")
        let outputRow = `${pricingZoneName} (${countries})`

        competitionGroups.data.forEach(competition => {
          let map = e.competitions.map(c => c.name).join("\n ")
          let outputRow = `${e.description} (${map})`

        })
      })

    })
      .catch(err => {
        throw new Error("Failed to complete", err)
      })
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