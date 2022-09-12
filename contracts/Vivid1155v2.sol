// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

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
contract Vivid1155v2 is ERC1155Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Mapping from token ID to token URIs
    mapping(uint256 => string) private _tokenCIDs;

    /**
     *
     */
    constructor()
        ERC1155("ipfs://{cid}")
    {
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
        string memory cid
    ) public onlyRole(MINTER_ROLE) {
        _mint(to, tokenId, amount, "");
        _tokenCIDs[tokenId] = cid;
    }

    function uri(uint256 tokenId)
        public 
        view 
        override 
        returns (string memory) 
    {
        return string(abi.encodePacked("ipfs://", _tokenCIDs[tokenId]));
    }

    function setCID(uint256 tokenId, string memory cid) 
        public 
        onlyRole(UPDATER_ROLE) 
    {
        _tokenCIDs[tokenId] = cid;
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
