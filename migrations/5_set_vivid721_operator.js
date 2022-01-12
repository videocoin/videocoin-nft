
const VIVID721 = artifacts.require('VIVID721');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const operator = process.env.NFT721_OPERATOR;
  if (!operator) {
    console.log('operator not set. Skip.');
    return;
  }

  const instance = await VIVID721.deployed(); 
  await instance.addOperator(operator);

  setConfig('deployed.' + network + '.VIVID721_operator', operator);
};