const Vivid721v2 = artifacts.require('Vivid721v2');
const BN = require('bn.js');
const crypto = require('crypto');

contract('Vivid721v2', (accounts) => {
  const admin = accounts[0];
  const minter = accounts[1];
  const updater = accounts[1];
  const owner = accounts[2];
  const attacker = accounts[3];
  const allowed = accounts[4];
  const url = 'https://dummy.io/metadata.json';
  const newURL = 'https://new-dummy.io/metadata.json';

  it('should has correct admin', async () => {
    const instance = await Vivid721v2.deployed();
    const role = await instance.DEFAULT_ADMIN_ROLE();
    const isAdmin = await instance.hasRole(role, admin);

    assert.isTrue(isAdmin, 'incorrect admin');
  });

  it('should set minter', async () => {
    const instance = await Vivid721v2.deployed();
    const role = await instance.MINTER_ROLE();
    await instance.grantRole(role, minter);
    const isMinter = await instance.hasRole(role, minter);
    
    assert.isTrue(isMinter, 'invalid minter');
  });

  it('should set updater', async () => {
    const instance = await Vivid721v2.deployed();
    const role = await instance.UPDATER_ROLE();
    await instance.grantRole(role, updater);
    const isUpdater = await instance.hasRole(role, updater);
    
    assert.isTrue(isUpdater, 'invalid updater');
  });

  it('should mint token with given URL', async () => {
    const instance = await Vivid721v2.deployed();
    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    const result = await instance.mint(owner, tokenId, url, {from: minter});
    const _tokenId = result.logs[0].args.tokenId;

    const _owner = await instance.ownerOf(tokenId);
    const _url = await instance.tokenURI(tokenId);

    assert.isTrue(tokenId.eq(_tokenId), 'invalid token ID');
    assert.equal(owner, _owner, 'invalid owner');
    assert.equal(url, _url, 'invalid URI');
  });

  it('should not allow non minter to mint token', async () => {
    const instance = await Vivid721v2.deployed();
    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    try {
      await instance.mint(owner, tokenId, url, {from: attacker});
    } catch (error) {
      const role = await instance.MINTER_ROLE();
      const expectedReason = `AccessControl: account ${attacker} is missing role ${role}`;
      assert.equal(error.reason.toLowerCase(), expectedReason.toLowerCase());
    }
  });

  it('should not allow nor updater to update token URI', async () => {
    const instance = await Vivid721v2.deployed();  
    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    await instance.mint(owner, tokenId, url, {from: minter});
    try {
      await instance.updateTokenURI(tokenId, 'dummy-text', {from: attacker});
    } catch (error) {
      const role = await instance.UPDATER_ROLE();
      const expectedReason = `AccessControl: account ${attacker} is missing role ${role}`;
      assert.equal(error.reason.toLowerCase(), expectedReason.toLowerCase());
    }
  });

  it('should allow updater to update token URI', async () => {
    const instance = await Vivid721v2.deployed();

    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    await instance.mint(owner, tokenId, url, {from: minter});

    await instance.updateTokenURI(tokenId, newURL, {from: updater});
    const _url = await instance.tokenURI(tokenId);

    assert.equal(newURL, _url, 'invalid URI');
  });

  it('should not allow revoked updater to update token URI', async () => {
    const instance = await Vivid721v2.deployed(); 

    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    await instance.mint(owner, tokenId, url, {from: minter});

    const role = await instance.UPDATER_ROLE();
    await instance.revokeRole(role, updater);
    try {
      await instance.updateTokenURI(tokenId, url, {from: updater});
    } catch (error) {
      const role = await instance.UPDATER_ROLE();
      const expectedReason = `AccessControl: account ${updater} is missing role ${role}`;
      assert.equal(error.reason.toLowerCase(), expectedReason.toLowerCase());
    }
  });

  it('should not allow non owner to burn token', async () => {
    const instance = await Vivid721v2.deployed(); 

    try {
      const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
      await instance.mint(owner, tokenId, url, {from: minter});
      await instance.burn(tokenId, {from: attacker});
    } catch (error) {
      assert.equal(error.reason, 'ERC721: caller is not token owner nor approved');
    }
  });

  it('should allow owner to burn token with given token ID', async () => {
    const instance = await Vivid721v2.deployed();
    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    await instance.mint(owner, tokenId, url, {from: minter});
    await instance.burn(tokenId, {from: owner});
  });

  it('should allow approved account to burn token with given token ID', async () => {
    const instance = await Vivid721v2.deployed();
    const tokenId = new BN(crypto.randomBytes(32).toString('hex'), 16);
    await instance.mint(owner, tokenId, url, {from: minter});
    await instance.approve(allowed, tokenId, {from: owner});
    await instance.burn(tokenId, {from: allowed});
  });
});