import { useState } from "react";
import './App.css';

import { ethers } from "ethers";
import GreeterArtifact from "./contracts/Greeter.json";
import WorkshopTokenArtifact from "./contracts/ERC20Token.json";

function App() {
  const greeterAddress = ""; // TODO: Greeter smart contract address 
  const tokenAddress = ""; // TODO: Token smart contract address 
  const [greet, setGreet] = useState("");
  const [greetInput, setGreetInput] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [balance, setBalance] = useState("0");
  const [targetAddress, setTargetAddress] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, GreeterArtifact.abi, provider)
      try {
        const data = await contract.greet();

        setGreet(data);
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function changeGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, GreeterArtifact.abi, provider);
      try {
        console.log(greetInput)
        const tx = await contract.connect(signer).setGreeting(greetInput);
        await tx.wait();

        console.log(tx)

        fetchGreeting();
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function fetchBalance() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const contract = new ethers.Contract(tokenAddress, WorkshopTokenArtifact.abi, provider);
      try {
        const balance = 0; // TODO: call contract to get balance of account

        setBalance(ethers.utils.commify(ethers.utils.formatUnits(balance, "ether")));
      } catch(err) {
        console.log("Error: ", err);
      }
    }
  }

  async function transfer() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, WorkshopTokenArtifact.abi, provider);
      const formattedTransferAmount = ethers.utils.parseUnits(transferAmount);
      try {
        const tx = await contract.connect(signer).transfer(targetAddress, formattedTransferAmount);
        await tx.wait();

        fetchBalance();
      } catch(err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <div className="App">
      <div style={{ marginTop: 40 }}>
        <h2>Greeter</h2>
        <div style={{ marginTop: 20 }}>
          <span>Current Greeting: </span>
          <span style={{ marginRight: 20 }}>{greet || "Click the button by my side"}</span>
          <button onClick={fetchGreeting}>Get current greeting</button>
        </div>
        <div style={{ marginTop: 20 }}>
          <label style={{ marginRight: 20 }}>Set new greeting</label>
          <input style={{ marginRight: 20 }} value={greetInput} type="text" onChange={(e) => setGreetInput(e.target.value)} />
          <button onClick={changeGreeting}>Set new greeting</button>
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2>Token</h2>
        <div>
          <span style={{ marginRight: 20 }}>Balance: {balance}</span>
          <button onClick={() => fetchBalance()}>Fetch</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ marginRight: 20 }}>AMOUNT</label>
          <input value={transferAmount} type="number" onChange={(e) => setTransferAmount(e.target.value)} />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ marginRight: 20 }}>ADDRESS</label>
          <input value={targetAddress} type="text" onChange={(e) => setTargetAddress(e.target.value)} />
        </div>

        <button style={{ marginTop: 20 }} onClick={() => transfer()}>TRANSFER</button>
      </div>
    </div>
  );
}


export default App;
