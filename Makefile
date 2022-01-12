ABIGEN_DOCKER=docker run \
	-v $(shell pwd):/solidity \
	-v $(shell pwd)/build:/build \
	--rm -ti ethereum/solc:0.7.6

.PHONY: abi
abi:
	mkdir -p build/
	SOLC="${ABIGEN_DOCKER}" ./scripts/solc.sh /build/bindings /solidity /solidity/contracts/NFT1155.sol
	SOLC="${ABIGEN_DOCKER}" ./scripts/solc.sh /build/bindings /solidity /solidity/contracts/VIVID721.sol

.PHONY: bindings
bindings:
	mkdir -p temp/
	abigen --abi build/bindings/NFT1155.abi --bin build/bindings/NFT1155.bin --pkg nft --out temp/NFT1155.go --type NFT1155
	abigen --abi build/bindings/VIVID721.abi --bin build/bindings/VIVID721.bin --pkg nft --out temp/VIVID721.go --type VIVID721