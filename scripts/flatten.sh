#!/bin/sh

rm -rf temp
mkdir -p temp

cd contracts
find . -type f -name "*.sol" -exec sed -i 's/pragma solidity 0.8.11/pragma solidity ^0.8.11/g' {} +
cd ..

alias flatten="./node_modules/.bin/truffle-flattener"

flatten contracts/VIVID721.sol --output temp/VIVID721.sol
flatten contracts/Vivid721v2.sol --output temp/Vivid721v2.sol
flatten contracts/VIVID1155.sol --output temp/VIVID1155.sol

cd contracts
find . -type f -name "*.sol" -exec sed -i 's/pragma solidity ^0.8.11/pragma solidity 0.8.11/g' {} +
cd ..