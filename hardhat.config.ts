import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.11",

   networks: {
    dev: { url: 'http://localhost:8545' },
    localgeth: { url: 'http://localgeth:8545' },
    videocoin_dev: {
	    url: 'https://dev.videocoin.network/rpc',
	    accounts: [process.env.VID_SIGNER_KEY]
    },
    videocoin_prod: {
	    url: 'https://videocoin.network/rpc',
	    accounts: [process.env.VID_SIGNER_KEY]
    },
    polygon: {
	    url: 'https://morning-clean-knowledge.matic.quiknode.pro/ba2985fca323a96dd1a0a1a311dc49873826eb4e/',
	    accounts: [process.env.VID_SIGNER_KEY]
    },

  },

};

export default config;
