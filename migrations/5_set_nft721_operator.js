
const NFT721 = artifacts.require('NFT721');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const operator = process.env.NFT721_OPERATOR;
  if (!operator) {
    console.log('operator not set. Skip.');
    return;
  }

  const instance = await NFT721.deployed(); 
  await instance.addOperator(operator);

  setConfig('deployed.' + network + '.NFT721_operator', operator);
};