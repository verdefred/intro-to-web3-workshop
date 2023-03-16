import { artifacts, ethers } from "hardhat";
import { Greeter } from "../typechain-types";
import fs from "fs";
import path from "path"

async function main() {
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Workshop!") as Greeter;

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  saveFrontendFiles(greeter);
}

function saveFrontendFiles(greeter: Greeter) {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  const GreeterArtifact = artifacts.readArtifactSync("Greeter");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "Greeter.json"),
    JSON.stringify(GreeterArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});