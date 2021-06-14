const NFT1155 = artifacts.require('NFT1155');

contract('NFT1155', (accounts) => {
  const owner = accounts[2];
  const tokenId = 123;

  it('should mint token with given ID', async () => {
    const instance = await NFT1155.deployed();
    await instance.mint(owner, tokenId);
    const balance = await instance.balanceOf(owner, tokenId);

    assert.equal(balance.toNumber(), 1, 'invalid balance');
  });
});