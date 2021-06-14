#!/bin/sh

rm -rf temp
mkdir -p temp

cd contracts
find . -type f -name "*.sol" -exec sed -i 's/pragma solidity 0.7.6/pragma solidity ^0.7.6/g' {} +
cd ..

alias flatten="./node_modules/.bin/solidity-flattener"

flatten contracts/NFT721.sol --output temp/NFT721.sol
flatten contracts/NFT1155.sol --output temp/NFT1155.sol

cd contracts
find . -type f -name "*.sol" -exec sed -i 's/pragma solidity ^0.7.6/pragma solidity 0.7.6/g' {} +
cd ..