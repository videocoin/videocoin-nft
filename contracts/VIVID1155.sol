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
    event Current(uint256 indexed curr);

    /**
     *
     * @dev `uri_` tokens base URI pattern.
     */
    constructor(address admin)
        ERC1155("ipfs://b{id}")
        Operable(admin)
    {}

    /**
     *
     * @dev Mint token using external token ID and amount.
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount
    ) public onlyOperator {
        _mint(to, tokenId, amount, "");
    }

    function uint2hexstr(uint256 i) public pure returns (string memory) {
        if (i == 0) return "0";
        uint256 j = i;
        uint256 length;
        while (j != 0) {
            length++;
            j = j >> 4;
        }
        uint256 mask = 15;
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (i != 0) {
            uint256 curr = (i & mask);
            bstr[--k] = curr > 9
                ? bytes1(uint8(55 + curr))
                : bytes1(uint8(48 + curr)); // 55 = 65 - 10
            i = i >> 4;
        }
        return string(bstr);
    }

    function uint2v1(uint256 id) public pure returns (string memory) {
        if (id == 0) return "aa";

        uint8[32] memory alphabet = [
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105,
            106,
            107,
            108,
            109,
            110,
            111,
            112,
            113,
            114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            50,
            51,
            52,
            53,
            54,
            55
        ];
        uint256 bits = 0;
        uint256 buffer = 0;

        uint256 header = 0x01551220;
        uint8 _byte = 0;

        bytes memory bstr = new bytes(58);
        uint256 idx = 0;
        uint256 mask = 31;
        for (uint256 i = 0; i < 36; ++i) {
            if (i < 4) {
                _byte = uint8(header >> (32 - (i + 1) * 8));
            } else {
                _byte = uint8(id >> (256 - (i - 3) * 8));
            }

            buffer = (buffer << 8) | _byte;
            bits += 8;

            while (bits > 5) {
                bits -= 5;
                bstr[idx++] = bytes1(alphabet[mask & (buffer >> bits)]);
            }
        }
        if (bits != 0) {
            bstr[idx] = bytes1(alphabet[mask & (buffer << (5 - bits))]);
        }
        return string(bstr);
    }

    function uri(uint256 _tokenID)
        public
        pure
        override
        returns (string memory)
    {
        string memory hexstringtokenID;
        hexstringtokenID = uint2hexstr(_tokenID);

        return string(abi.encodePacked("ipfs://f01551220", hexstringtokenID));
    }

    function uriV1(uint256 _tokenID)
        public
        pure
        returns (string memory)
    {
        string memory cidstringtokenID;
        cidstringtokenID = uint2v1(_tokenID);

        return string(abi.encodePacked("ipfs://b", cidstringtokenID));
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
