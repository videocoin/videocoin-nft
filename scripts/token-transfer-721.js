require('dotenv').config();
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');

const abi = JSON.parse(fs.readFileSync('build/contracts/VIVID721.json')).abi;

const faucetKey = process.env.FAUCET_KEY;
const customRpc = process.env.CUSTOM_RPC;
const vivid721addr = process.env.VIVID721_ADDR;
const tokenOwnerKey = process.env.TOKEN_OWNER_KEY;
const recipient = process.env.RECIPIENT || '0x000000000000000000000000000000000000dEaD';
const tokenID = process.env.TOKEN_ID;

const faucetProvider = new HDWalletProvider(faucetKey, customRpc)
const faucet = new Web3(faucetProvider);

const ownerProvider = new HDWalletProvider(tokenOwnerKey, customRpc);
const owner = new Web3(ownerProvider);

async function main() {
    const faucetAcc = await faucetProvider.getAddress(0);
    const ownerAcc = await ownerProvider.getAddress(0);

    const vivid721 = new owner.eth.Contract(abi, vivid721addr);

    const gas = await owner.eth.estimateGas({
        value: 0x0,
        data: vivid721.methods.transferFrom(ownerAcc, recipient, tokenID).encodeABI(),
        from: ownerAcc,
        to: vivid721addr,
    })

    const gasPrice = await owner.eth.getGasPrice();
    const txCost = gas * gasPrice;

    console.log('tx cost       ', txCost);

    const ownerBalance = await owner.eth.getBalance(ownerAcc);
    console.log('owners balance', ownerBalance);
    if (ownerBalance < txCost) {
        const tx = await faucet.eth.sendTransaction({
            from: faucetAcc,
            to: ownerAcc,
            value: txCost - ownerBalance,
        });

        console.log('top up the balance', tx.transactionHash);
    }

    const tokenOwner = await vivid721.methods.ownerOf(tokenID).call();
    if (tokenOwner.toLowerCase() === ownerAcc.toLocaleLowerCase()) {
        try {
            const tx = await vivid721.methods.transferFrom(ownerAcc, recipient, tokenID).send({from: ownerAcc});
            console.log('transfer', tx.transactionHash);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('sender is not an owner');
    }

    process.exit();
};

main();

