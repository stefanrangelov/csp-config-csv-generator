const csv_parse = require("csv-stringify")
const https = require('https');
const conf = require('../config/config');
const { resolve } = require("path");
const axios = require('axios').default;

async function getUsers() {
  try {
    const response = await axios.get(`https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
getUsers()

let result



// doSomethingUseful()

function getzones(){
    return getPricingZones();
}

async function doSomethingUseful() {
    // return the response
      doRequest().then(data => {
        console.log("Inisde promise consumer")
      })
     console.log(result)

  }

async function getPricingZones(){
    https.get('https://fmu.qacore.gbpdev.isp.starsops.com/fmu/retrieve-dimension-groups/brand/ps/pricing-zones', res => {
        let data = "";
    
        // A chunk of data has been recieved.
        res.on("data", chunk => {
          data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        res.on("end", () => {
          let url = JSON.parse(data);
          result = url  
          resolve(JSON.parse(data))
        });
    })

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
          let url = JSON.parse(data);
          result = url  
          resolve(url)
        });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      req.end();
    });
  })

}

