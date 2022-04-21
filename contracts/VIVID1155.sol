// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "./Operable.sol";

/**
 *
 * @dev Implementation of the NFT standard token (ERC1155).
 * Operated by VideoCoin market place.
 * 
 * Contract accepds IPFS CID as token ID. Beforehand, CID must 
 * be converted to acceptable format. Example:
 * IPFS CID: bafkreihlh7bj43w2ohnfqey2lamervfqonk4guffvlrsnd23e4obxxzinu
 * ```
 * > ipfs cid format -b=base16 bafkreihlh7bj43w2ohnfqey2lamervfqonk4guffvlrsnd23e4obxxzinu
 * f01551220eb3fc29e6eda71da58131a581848d4b07355c350a5aae3268f5b271c1bdf286d
 * ```
 * Heximal representation of CID is longer than 32 bytes which is not suitable for uint256 type.
 * Fortunately, 
 * `f01551220` - is encoded CID header. So it can be embedded into contract.
 */
contract VIVID1155 is ERC1155Burnable, Operable {

	/**
     *
     * @dev `uri_` tokens base URI pattern.
	 */
	constructor (address admin) ERC1155("ipfs://f01551220{id}") Operable(admin) {
	}

    /**
     *
     * @dev Mint token using external token ID and amount.
     */
	function mint(address to, uint256 tokenId, uint256 amount) public onlyOperator {
		_mint(to, tokenId, amount, "");
	}

	function uint2hexstr(uint256 i) public pure returns (string memory) {
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0) {
            length++;
            j = j >> 4;
        }
        uint mask = 15;
        bytes memory bstr = new bytes(length);
        uint k = length;
        while (i != 0) {
            uint curr = (i & mask);
            bstr[--k] = curr > 9 ?
                bytes1(uint8(55 + curr)) :
                bytes1(uint8(48 + curr)); // 55 = 65 - 10
            i = i >> 4;
        }
        return string(bstr);
    }

	function uri(uint256 _tokenID) override public pure returns (string memory) {
       	string memory hexstringtokenID;
    	hexstringtokenID = uint2hexstr(_tokenID);
    
		return string(abi.encodePacked("ipfs://f01551220", hexstringtokenID));
    }

	function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}