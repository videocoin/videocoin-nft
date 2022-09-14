// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 *
 * @dev Implementation of the NFT standard token (ERC1155).
 * Operated by VideoCoin market place.
 */
contract Vivid1155v2 is ERC1155Burnable, ERC1155URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    /**
     *
     */
    constructor() ERC1155("ipfs://{cid}") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    /**
     *
     * @dev Mint token using external token ID and amount.
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        string memory tokenURI
    ) public onlyRole(MINTER_ROLE) {
        _mint(to, tokenId, amount, "");
        _setURI(tokenId, tokenURI);
    }

    function uri(uint256 tokenId)
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return super.uri(tokenId);
    }

    function setURI(uint256 tokenId, string memory tokenURI)
        public
        onlyRole(UPDATER_ROLE)
    {
        super._setURI(tokenId, tokenURI);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
