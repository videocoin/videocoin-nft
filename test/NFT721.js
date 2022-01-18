const VIVID721 = artifacts.require('VIVID721');

let tokenId;

contract('VIVID721', (accounts) => {
  const admin = accounts[0];
  const operator = accounts[1];
  const owner = accounts[2];
  const attacker = accounts[3];
  const url = 'https://dummy.io/metadata.json';
  const newURL = 'https://new-dummy.io/metadata.json';

  it('should has correct admin', async () => {
    const instance = await VIVID721.deployed();
    const isAdmin = await instance.isAdmin(admin);

    assert.equal(isAdmin, true, 'incorrect admin');
  });

  it('should set operator', async () => {
    const instance = await VIVID721.deployed();
    await instance.addOperator(operator);
    const isOperator = await instance.isOperator(operator);
    
    assert.equal(true, isOperator, 'invalid operator');
  });

  it('should mint token with given URL', async () => {
    const instance = await VIVID721.deployed();
    const result = await instance.mint(owner, url, {from: operator});
    tokenId = result.logs[0].args.tokenId;

    const _owner = await instance.ownerOf(tokenId);
    const _url = await instance.tokenURI(tokenId);

    assert.equal(owner, _owner, 'invalid owner');
    assert.equal(url, _url, 'invalid URI');
  });

  it('should not allow non-operator to update token URI', async () => {
    const instance = await VIVID721.deployed(); 
    try {
      await instance.updateTokenURI(tokenId, 'dummy-text', {from: attacker});
    } catch (error) {
      assert.equal(error.reason, 'Operable: restricted to operators');
    }
  });

  it('should allow operator to update token URI', async () => {
    const instance = await VIVID721.deployed();
    await instance.updateTokenURI(tokenId, newURL, {from: operator});
    const _url = await instance.tokenURI(tokenId);

    assert.equal(newURL, _url, 'invalid URI');
  });

  it('should not allow revoked operator to update token URI', async () => {
    const instance = await VIVID721.deployed(); 
    await instance.removeOperator(operator);
    try {
      await instance.updateTokenURI(tokenId, url, {from: operator});
    } catch (error) {
      assert.equal(error.reason, 'Operable: restricted to operators');
    }
  });
});