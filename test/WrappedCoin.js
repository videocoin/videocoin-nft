const WrappedCoin = artifacts.require('WrappedCoin')

contract('WrappedCoin', (accounts) => {
  const account1 = accounts[0];
  const account2 = accounts[1];
  const attacker = accounts[2];
  const spender = accounts[3];
  const weiAmount = web3.utils.toWei("1.5");
  const weiAmount2 = web3.utils.toWei("2.5");

  it('should mint token with given equivalent deposited', async () => {
    const instance = await WrappedCoin.deployed();
    await instance.deposit({value: weiAmount, from: account1});
    await instance.deposit({value: weiAmount2, from: account2})
    const balance1 = await instance.balanceOf(account1);
    const balance2 = await instance.balanceOf(account2);

    assert.equal(balance1, weiAmount, 'incorect amout minted');
    assert.equal(balance2, weiAmount2, 'incorect amout minted');
  });

  it('should containt exact balance as totalSupply', async () => {
    const instance = await WrappedCoin.deployed();
    const balance = await web3.eth.getBalance(instance.address);
    const totalSupply = await instance.totalSupply();

    assert.equal(balance, totalSupply, 'totalSupply and balance mismatch');
  });

  it('should not allow account without balance to withdraw coins', async () => {
    const instance = await WrappedCoin.deployed();
    try {
        await instance.withdraw(weiAmount, {from: attacker});
        assert.equal(false, 'deposit withdrawn');
    } catch (error) {
        assert.equal(error.reason, 'WrappedCoin: burn amount exceeds balance');
    }
  });

  it('should not allow to withdraw more than deposited', async () => {
    const instance = await WrappedCoin.deployed();
    try {
        await instance.withdraw(weiAmount2, {from: account1});
        assert.equal(false, 'deposit withdrawn');
    } catch (error) {
        assert.equal(error.reason, 'WrappedCoin: burn amount exceeds balance');
    }
  });

  it('should not allow spender to withdraw deposit', async () => {
    const instance = await WrappedCoin.deployed();
    await instance.approve(spender, weiAmount);

    try {
      await instance.withdraw(weiAmount, {from: spender});
      assert.equal(false, 'deposit withdrawn');
    } catch(error) {
      assert.equal(error.reason, 'WrappedCoin: burn amount exceeds balance');
    }
  });

  it('should withdraw deposited amount', async () => {
    const instance = await WrappedCoin.deployed();
    await instance.withdraw(weiAmount, {from: account1});
    const balance = await web3.eth.getBalance(instance.address);
    const accountBalance = await instance.balanceOf(account2);

    assert.equal(balance, accountBalance, 'incorrect amount left after withdrawal');
  });

  it('should not allow to deposit using transfer', async () => {
    const instance = await WrappedCoin.deployed();

    try {
      await web3.eth.sendTransaction({from: account1, to: instance.address, value: weiAmount});
      assert.equal(false, 'deposit succeded');
    } catch {}
  });
});