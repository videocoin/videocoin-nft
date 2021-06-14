const NFT1155 = artifacts.require('NFT1155');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const uri = network == 'development' ? 'https://dummy.io/{id}.json' : process.env.NFT1155_URI;

  await deployer.deploy(NFT1155, uri);
  setConfig('deployed.' + network + '.NFT1155', NFT1155.address);
};