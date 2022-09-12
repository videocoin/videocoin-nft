const Vivid1155v2 = artifacts.require('Vivid1155v2');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Vivid1155v2);
  setConfig('deployed.' + network + '.Vivid1155v2', Vivid1155v2.address);
};