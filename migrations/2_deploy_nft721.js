const NFT721 = artifacts.require('NFT721');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const name = network == 'development' ? 'Test' :process.env.NFT721_NAME;
  const symbol = network == 'development' ? 'TST' : process.env.NFT721_SYMBOL;
  const admin = network == 'development' ? accounts[0] : process.env.NFT721_ADMIN;

  await deployer.deploy(NFT721, name, symbol, admin);
  setConfig('deployed.' + network + '.NFT721', NFT721.address);
};