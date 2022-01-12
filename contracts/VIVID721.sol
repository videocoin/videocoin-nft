// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Operable.sol";

/**
 *
 * @dev Implementation of the NFT standard token (ERC721).
 * Operated by VideoCoin market place.
 */
contract VIVID721 is ERC721URIStorage, Operable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

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
	function mint(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
		_mint(to, newItemId);
		_setTokenURI(newItemId, tokenURI);

        return newItemId;
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

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}