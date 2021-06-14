#!/bin/bash

SOLC=${SOLC:-solc}

build=$1
deps=$2
contract=$3

$SOLC --abi -o $build --overwrite --allow-paths $deps @openzeppelin=$deps/node_modules/@openzeppelin $contract
$SOLC --bin -o $build --overwrite --allow-paths $deps @openzeppelin=$deps/node_modules/@openzeppelin $contract