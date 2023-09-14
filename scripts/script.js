const csv = require("csv-stringify");
const https = require('https');
const conf = require('../config/config');
const fs = require("fs")

let pricingZones 

doSomethingUseful()


async function doSomethingUseful() {
    // return the response
     await doRequest();
     let pricingZone = pricingZones.data[0];
     let pricingZoneName = pricingZone.description
     let countries = pricingZone.countries.map(e=>e.iso2Code).join(",")
     let outputRow = `${pricingZoneName}(${countries})`
     const data = [
        [ 'Prizing Zone' ],
        [ outputRow ]
      ]
     csv.stringify(data, (err, output) => {
        fs.writeFileSync("../generatedFiles/csp.csv", output);
        console.log("OK");
      });
     console.log(outputRow)
  }


function doRequest() {
    return new Promise((resolve, reject) => {
      const req = https.get('https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones', res => {
        let data = "";
    
        // A chunk of data has been recieved.
        res.on("data", chunk => {
          data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        res.on("end", () => {
          pricingZones = JSON.parse(data);
          resolve(pricingZones)
        });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      req.end();
    });
  })

}

