import { ethers } from "hardhat";

async function main() {

  const Vivid721v2 = await ethers.getContractFactory("Vivid721v2");
  const vivid721v2 = await Vivid721v2.deploy(process.env.CONTRACT_NAME, process.env.CONTRACT_SYMBOL);

  const txn = await vivid721v2.deployed();

  console.log( txn);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
