import { ethers } from "hardhat";

async function main() {

  const Vivid1155v2 = await ethers.getContractFactory("Vivid1155v2");
  const vivid1155v2 = await Vivid1155v2.deploy(process.env.CONTRACT_NAME, process.env.CONTRACT_SYMBOL);

  const instance = await vivid1155v2.deployed();
  console.log( instance);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
