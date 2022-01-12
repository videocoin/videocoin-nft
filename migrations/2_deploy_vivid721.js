const VIVID721 = artifacts.require('VIVID721');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const name = network == 'development' ? 'Test' :process.env.NFT721_NAME;
  const symbol = network == 'development' ? 'TST' : process.env.NFT721_SYMBOL;
  const admin = network == 'development' ? accounts[0] : process.env.NFT721_ADMIN;

  await deployer.deploy(VIVID721, name, symbol, admin || accounts[0]);
  setConfig('deployed.' + network + '.VIVID721', VIVID721.address);
};