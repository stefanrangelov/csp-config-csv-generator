process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const ENVS = {
  qarelease: 'https://fmu.qarelease.gbpqarelease.isp.starsops.com', 
  qacore: 'https://fmu.qacore.gbpdev.isp.starsops.com',
  prod: 'https://fmu.prod.gbp.isp.starsops.com'
}

const ENDPOINTS = {
   RETRIEVE_PRICING_ZONES: '/fmu/retrieve-dimension-groups/brand/ps/pricing-zones'
}

module.exports = {
    ENVS, ENDPOINTS
};

