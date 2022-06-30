const Vivid721v2 = artifacts.require('Vivid721v2');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const name = network == 'development' ? 'Test' :process.env.NFT721_NAME;
  const symbol = network == 'development' ? 'TST' : process.env.NFT721_SYMBOL;

  await deployer.deploy(Vivid721v2, name, symbol);
  setConfig('deployed.' + network + '.Vivid721v2', Vivid721v2.address);
};