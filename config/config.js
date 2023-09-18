process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const ENVS = {
  qarelease: 'fmu.qarelease.gbpqarelease.isp.starsops.com', 
  qacore: 'fmu.qacore.gbpdev.isp.starsops.com',
  prod: 'fmu.prod.gbp.isp.starsops.com'
}

module.exports = {
    ENVS
};

