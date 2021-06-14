// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Operable.sol";

/**
 *
 * @dev Implementation of the NFT standard token (ERC721).
 * Operated by VideoCoin market place.
 */
contract NFT721 is ERC721, Operable {

    /**
     *
     * @dev `admin` is default administrator of the contract.
     */
	constructor (string memory name, string memory symbol, address payable admin) 
        ERC721(name, symbol) 
        Operable(admin) {}

    /**
     *
     * @dev Mint token using external token ID and URI.
     */
	function mint(address to, uint256 tokenId, string memory tokenURI) public {
		_mint(to, tokenId);
		_setTokenURI(tokenId, tokenURI);
	}

    /**
     *
     * @dev Only operator is allowed to update token URI.
     * 
     * This method is invoked by VideoCoin marketplace to update token URI
     * right after transfer. As VideoCoin is dealing with encrypted video
     * hosted on IPFS/FileCoin, every time when token is passed to a new
     * owner video reencryption with owner's key is invoked. This requires
     * to update URI accordingly to new IPFS/FileCoin CID. Otherwise owner
     * won't be able to prove ownership of a token. 
     *
     * Token transfer is powered by VideoCoin Proof-of-Ownership mechanism.  
     * See https://medium.com/videocoin/nft-proof-of-ownership-on-filecoin-videocoin-how-to-store-nfts-right-4c828a09f0a2
     */
	function updateTokenURI(uint256 tokenId, string memory tokenURI) public onlyOperator {
		_setTokenURI(tokenId, tokenURI);
	}
}