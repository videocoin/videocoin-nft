// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @dev Contract module that implements role-based access control mechanisms.
 *
 * Introduced `OPERATOR_ROLE` role to represent operator permission. For 
 * convinience, operator role was encorporated into {onlyOperator} modifier 
 * along with {onlyAdmin} modifier. 
 * 
 * To grant or revoke permission to other accounts administrator has to invoke
 * {addAdmin}, {addOperator} and {removeOperator} methods respectively.
 *
 * WARNING: administrator can get rid of admin permission using {renounceAdmin}
 * method only.
 */
abstract contract Operable is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR");

    /**
     * @dev `root` default administrator account.
     */
    constructor(address root) {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
    }

    modifier onlyAdmin() {
        require(isAdmin(_msgSender()), "Operable: restricted to admins");
        _;
    }

    modifier onlyOperator() {
        require(isOperator(_msgSender()), "Operable: restricted to operators");
        _;
    }

    function isAdmin(address account) public virtual view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isOperator(address account) public virtual view returns (bool) {
        return hasRole(OPERATOR_ROLE, account);
    }

    function addAdmin(address account) public virtual onlyAdmin {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function addOperator(address account) public virtual onlyAdmin {
        grantRole(OPERATOR_ROLE, account);
    }

    function renounceAdmin() public virtual onlyAdmin {
        renounceRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function removeOperator(address account) public virtual onlyAdmin {
        revokeRole(OPERATOR_ROLE, account);
    }
}