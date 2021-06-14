# VideoCoin NFT contracts

NFT smart contracts operated by VideoCoin NFT marketplace.

## Pre-requirements

Ganache-cli and Truffle has to be installed.

## Deployment

Install dependencies:

```$sh
npm install
```

Use `.env.template` to create and configure `.env` file:

```$.evn
PRIVATE_RPC=https://rpc.my-nft.io
MNENONIC=abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
INFURA_KEY=
NFT721_NAME=MyTestNFT
NFT721_SYMBOL=MTNFT
NFT1155_URI=https://storage.my-nft.io/{id}.json
```

Run tests:

```$sh
npm run test
```

Deploy contracts to private network:

```$sh
truffle deploy --network private
```

## Flatten smart contracts

To flatten smart contracts, run:

```$sh
scripts/flatten.sh
```

resulting files will resgin in `temp` folder.

## Golang bindings

To generate golang bindings, run:

```$sh
make abi
make bindings
```

resulting files will resgin in `temp` folder.