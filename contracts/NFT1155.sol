// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 *
 * @dev Implementation of the NFT standard token (ERC1155).
 * Operated by VideoCoin market place.
 */
contract NFT1155 is ERC1155 {

	/**
     *
     * @dev `uri_` tokens base URI pattern.
     * 
     * 
     * See {_setURI} for more information.
	 */
	constructor (string memory uri_) ERC1155(uri_) {
	}

    /**
     *
     * @dev Mint token using external token ID.
     */
	function mint(address to, uint256 tokenId) public {
		_mint(to, tokenId, 1, "");
	}
}