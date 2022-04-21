const VIVID1155 = artifacts.require('VIVID1155');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const admin = network == 'development' ? accounts[0] : process.env.NFT721_ADMIN;
  await deployer.deploy(VIVID1155, admin);
  setConfig('deployed.' + network + '.VIVID1155', VIVID1155.address);
};