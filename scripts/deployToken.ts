import { artifacts, ethers } from "hardhat";
import { Token } from "../typechain-types";
import fs from "fs";
import path from "path"

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy() as Token;

  await token.deployed();

  console.log("Token deployed to:", token.address);
  saveFrontendFiles(token);
}

function saveFrontendFiles(token: Token) {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  const TokenArtifact = artifacts.readArtifactSync("Token");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
