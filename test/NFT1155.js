const VIVID1155 = artifacts.require('VIVID1155');

contract('NFT1155', (accounts) => {
  const admin = accounts[0];
  const owner = accounts[2];
  const operator = accounts[1];
  const attacker = accounts[3];
  const pureTokenId = 'eb3fc29e6eda71da58131a581848d4b07355c350a5aae3268f5b271c1bdf286d';
  const tokenId = `0x${pureTokenId}`;
  const tokenUri = `ipfs://f01551220${pureTokenId}`;
  const tokenUriV1 = 'ipfs://bafkreihlh7bj43w2ohnfqey2lamervfqonk4guffvlrsnd23e4obxxzinu';

  it('should mint 10 tokens with given ID', async () => {
    const instance = await VIVID1155.deployed();
    await instance.addOperator(operator, {from: admin});
    await instance.mint(owner, tokenId, 10, {from: operator});
    const balance = await instance.balanceOf(owner, tokenId);

    assert.equal(balance.toNumber(), 10, 'invalid balance');
  });

  it('should provide correct IPFS URI to given to given token ID', async () => {
    const instance = await VIVID1155.deployed();
    const uri = await instance.uri(tokenId);
    const uriV1 = await instance.uriV1(tokenId);

    assert.equal(uri.toLowerCase(), tokenUri.toLocaleLowerCase(), 'incorrect URI');
    assert.equal(uriV1, tokenUriV1, 'incorrect URI');
  });

  it('should not allow non-operator to mint token', async () => {
    const instance = await VIVID1155.deployed();
    try {
      await instance.mint(owner, tokenId, 10, {from: attacker});
    } catch (error) {
      assert.equal(error.reason, 'Operable: restricted to operators');
    }
  });

  it('should not allow non-owner to burn token', async () => {
    const instance = await VIVID1155.deployed(); 
    try {
      await instance.burn(owner, tokenId, 10, {from: attacker});
    } catch (error) {
      assert.equal(error.reason, 'ERC1155: caller is not token owner nor approved');
    }
  });

  it('should allow owner to burn token with given token ID', async () => {
    const instance = await VIVID1155.deployed();
    await instance.burn(owner, tokenId, 10, {from: owner});
    const balance = await instance.balanceOf(owner, tokenId);
    assert.equal(balance.toNumber(), 0, 'invalid balance');
  });
});