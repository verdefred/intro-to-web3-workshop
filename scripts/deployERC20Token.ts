
import { artifacts, ethers } from "hardhat";
import { ERC20Token } from "../typechain-types";
import fs from "fs";
import path from "path"

async function main() {
  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const workshopToken = await ERC20Token.deploy(ethers.utils.parseUnits("1000000")) as ERC20Token;

  await workshopToken.deployed();

  console.log("Token deployed to:", workshopToken.address);
  saveFrontendFiles(workshopToken);
}

function saveFrontendFiles(workshopToken: ERC20Token) {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  const ERC20TokenArtifact = artifacts.readArtifactSync("ERC20Token");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "ERC20Token.json"),
    JSON.stringify(ERC20TokenArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});