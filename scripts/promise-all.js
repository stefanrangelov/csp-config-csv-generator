const csv = require("csv-stringify");
const https = require('https');
const { ENVS, ENDPOINTS } = require('../config/config');
const fs = require("fs")
const Promise = require('bluebird');

let csvFile = [
  ['Pricing Zone', 'Competition Group']
]

let csvFile2 = [
  ['Pricing Zone']
]

let host = ENVS['qacore']

const getPricingZones = () => executeRequest(`${host}${ENDPOINTS.RETRIEVE_PRICING_ZONES}`)
const getCompetitionGroups = (id) => executeRequest(`${host}${ENDPOINTS.RETRIEVE_PRICING_ZONES}/${id}/competition-groups`)
// margines()
//   .then(res => {
//     res = JSON.parse(res)
//     let markets = res.data.marketTypes.map;
//     let counter = 0
//     Object.keys(markets).forEach(key => {
//       let x = markets[key]
//       let marginCharts = x.marginCharts
//       // console.log(marginCharts)
//       let result = Object.values(marginCharts).some(e => e.value != 0)
//       if (result) {
//         counter++
//       }
//       // console.log(result)
//     });
//     console.log(counter)
//   })

// createCsvFile2()
createCsvFile()

function margines() {
  const json = {
    competitionIds: ["13204", "3356", "388", "332"],
    rulesParams: {
      brand: "PS",
      pricingZoneId: "369",
      competitionGroupId: "19572"
    },
    sportId: "49"
  }

  const data = JSON.stringify(json)
  // const data = '{"competitionIds":["13204","3356","388","332"],"rulesParams":{"brand":"PS","pricingZoneId":"369","competitionGroupId":"19572"},"sportId":"49"}  '
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
    timeout: 5000, // in ms
  }

  return new Promise((resolve, reject) => {
    const req = https.request('https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-market-types', options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`))
      }

      let body = ""
      res.on('data', (chunk) => {
        body += (chunk)
      })
      res.on('end', () => {
        resolve(JSON.parse(body))
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request time out'))
    })

    req.write(data)
    req.end()
  })
}

function createCsvFile2(){
  getPricingZones().then(res => {
    res.data.forEach(pricingZone => {

      let pricingZoneName = pricingZone.description
      let countries = pricingZone.countries.map(e => e.iso2Code).join(", ")
      let pricingZoneOutput = `${pricingZoneName} (${countries})`

      csvFile2.push([pricingZoneOutput])
     
  })
  csv.stringify(csvFile2, (err, output) => {
    fs.writeFileSync("../generatedFiles/csp.csv", output);
    console.log("OK.");
  });
})
}

function createCsvFile() {
  // return the response
  getPricingZones().then(res => {
    let pricingZones = res.data
    pricingZones = [pricingZones[1]]

    Promise.map(pricingZones, function (pricingZone) {
      // Promise.map awaits for returned promises as well.
      return getCompetitionGroups(pricingZone.id)
        .then(competitionGroups => {
          return { pricingZone, competitionGroups }
        });
    }).then(res => {
      res.forEach(data => {
        let { pricingZone, competitionGroups } = data

        let pricingZoneName = pricingZone.description
        let countries = pricingZone.countries.map(e => e.iso2Code).join(", ")
        let pricingZoneOutput = `${pricingZoneName} (${countries})`

        let pricingZoneId = pricingZone.id
        let competitionIds = []


        competitionGroups.data.forEach(competitionGroup => {
          let competitionGroupName = competitionGroup.description
          let map = competitionGroup.competitions.map(c => {
            competitionIds.push(c.id)
            return c.name
          }).join(",\n ")
          let competitionGroupOutput = `${competitionGroupName} \n( ${map})`
          csvFile.push([pricingZoneOutput, competitionGroupOutput])
        })
      })
    })
      .catch(err => {
        throw new Error("Failed to complete", err)
      })
      .finally(() => {
        csv.stringify(csvFile, (err, output) => {
          fs.writeFileSync("../generatedFiles/csp.csv", output);
          console.log("OK.");
        });
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