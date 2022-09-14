ABIGEN_DOCKER=docker run \
	-v $(shell pwd):/solidity \
	-v $(shell pwd)/build:/build \
	--rm -ti ethereum/solc:0.8.11

.PHONY: abi
abi:
	mkdir -p build/
	SOLC="${ABIGEN_DOCKER}" ./scripts/solc.sh /build/bindings /solidity /solidity/contracts/VIVID1155.sol
	SOLC="${ABIGEN_DOCKER}" ./scripts/solc.sh /build/bindings /solidity /solidity/contracts/VIVID721.sol
	SOLC="${ABIGEN_DOCKER}" ./scripts/solc.sh /build/bindings /solidity /solidity/contracts/Vivid721v2.sol
	SOLC="${ABIGEN_DOCKER}" ./scripts/solc.sh /build/bindings /solidity /solidity/contracts/Vivid1155v2.sol

.PHONY: bindings
bindings:
	mkdir -p temp/
	abigen --abi build/bindings/VIVID1155.abi --bin build/bindings/VIVID1155.bin --pkg nft --out temp/VIVID1155.go --type VIVID1155
	abigen --abi build/bindings/VIVID721.abi --bin build/bindings/VIVID721.bin --pkg nft --out temp/VIVID721.go --type VIVID721
	abigen --abi build/bindings/Vivid721v2.abi --bin build/bindings/Vivid721v2.bin --pkg nft --out temp/Vivid721v2.go --type Vivid721v2
	abigen --abi build/bindings/Vivid1155v2.abi --bin build/bindings/Vivid1155v2.bin --pkg nft --out temp/Vivid1155v2.go --type Vivid1155v2