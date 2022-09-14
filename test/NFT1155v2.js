const Vivid1155v2 = artifacts.require('Vivid1155v2');

contract('NFT1155v2', (accounts) => {
  const admin = accounts[0];
  const minter = accounts[1];
  const updater = accounts[1];
  const owner = accounts[2];
  const attacker = accounts[3];
  const tokenId = '0xeb3fc29e6eda71da58131a581848d4b07355c350a5aae3268f5b271c1bdf286d';
  const tokenUri = `ipfs://bafkreihlh7bj43w2ohnfqey2lamervfqonk4guffvlrsnd23e4obxxzinu`;
  const tokenUri2 = `ipfs://QmfJpRfF6imMwJsVK16QG82q7zK8N78PYkznhg2AZPi2Cr`;

  it('should mint 10 tokens with given ID', async () => {
    const instance = await Vivid1155v2.deployed();
    await instance.mint(owner, tokenId, 10, tokenUri, {from: admin});
    const balance = await instance.balanceOf(owner, tokenId);
    const uri = await instance.uri(tokenId);

    assert.equal(balance.toNumber(), 10, 'invalid balance');
    assert.equal(uri, tokenUri, 'wrong token URI');
  });

  it('should be able to update CID', async () => {
    const instance = await Vivid1155v2.deployed();
    await instance.setURI(tokenId, tokenUri2);
    const uri = await instance.uri(tokenId);

    assert.equal(uri, tokenUri2, 'incorrect URI');
  });

  it('should not allow non-operator to mint token', async () => {
    const instance = await Vivid1155v2.deployed();
    try {
      await instance.mint(owner, tokenId, 10, tokenUri, {from: attacker});
    } catch (error) {
      const role = await instance.MINTER_ROLE();
      const expectedReason = `AccessControl: account ${attacker} is missing role ${role}`;
      assert.equal(error.reason.toLowerCase(), expectedReason.toLowerCase());
    }
  });

  it('should not allow non-owner to burn token', async () => {
    const instance = await Vivid1155v2.deployed(); 
    try {
      await instance.burn(owner, tokenId, 10, {from: attacker});
    } catch (error) {
      assert.equal(error.reason, 'ERC1155: caller is not token owner nor approved');
    }
  });

  it('should allow owner to burn token with given token ID', async () => {
    const instance = await Vivid1155v2.deployed();
    await instance.burn(owner, tokenId, 10, {from: owner});
    const balance = await instance.balanceOf(owner, tokenId);
    assert.equal(balance.toNumber(), 0, 'invalid balance');
  });

  it('should mint 10 tokens with given ID by operator', async () => {
    const instance = await Vivid1155v2.deployed();
    const role = await instance.MINTER_ROLE();
    await instance.grantRole(role, minter);
    await instance.mint(owner, tokenId, 10, tokenUri, {from: minter});
    const balance = await instance.balanceOf(owner, tokenId);
    const uri = await instance.uri(tokenId);

    assert.equal(balance.toNumber(), 10, 'invalid balance');
    assert.equal(uri, tokenUri, 'wrong token URI');
  });

  it('should be able to update CID using updated account', async () => {
    const instance = await Vivid1155v2.deployed();
    const role = await instance.UPDATER_ROLE();
    await instance.grantRole(role, updater);
    await instance.setURI(tokenId, tokenUri2, {from: updater});
    const uri = await instance.uri(tokenId);

    assert.equal(uri, tokenUri2, 'incorrect URI');
  });
});