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
    string public name;
    string public symbol;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    /**
     *
     */
    constructor(string memory _name, string memory _symbol) ERC1155("") {
        name = _name;
        symbol = _symbol;

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
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        require(exists(tokenId), "Vivid1155v2: token is not intialized");
        _mint(to, tokenId, amount, "");
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

    function initialize(uint256 tokenId, string memory tokenURI)
        public
        onlyRole(MINTER_ROLE)
    {
        require(!exists(tokenId), "Vivid1155v2: token already intialized");
        super._setURI(tokenId, tokenURI);
    }

    function updateURI(uint256 tokenId, string memory tokenURI)
        public
        onlyRole(UPDATER_ROLE)
    {
        require(exists(tokenId), "Vivid1155v2: token is not intialized");
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

    function exists(uint256 tokenId) public view returns (bool) {
        return bytes(super.uri(tokenId)).length > 0;
    }
}
