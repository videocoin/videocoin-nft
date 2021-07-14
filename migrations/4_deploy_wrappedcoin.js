const WrappedCoin = artifacts.require('WrappedCoin');

const { setConfig } = require('./config.js');

module.exports = async function (deployer, network, accounts) {
  const name = network === 'development' ? 'WrappedCoin' : process.env.WRAPPED_COIN_NAME;
  const symbol = network === 'development' ? 'WCOIN' : process.env.WRAPPED_COIN_SYMBOL;

  await deployer.deploy(WrappedCoin, name, symbol);
  setConfig('deployed.' + network + '.WrappedCoin', WrappedCoin.address);
};