//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
  uint256 public constant MAX_SUPPLY = 1000000 ether;
  
  constructor(uint256 initialSupply) ERC20("Workshop", "Workshop") {
    _mint(msg.sender, initialSupply); 
  }

  function mint(address _to, uint256 _amount) public {
    uint256 amountAfterMint = totalSupply() + _amount;
    // TODO: what is missing here?
    _mint(_to, _amount);
  }

  function burn(address _from, uint256 _amount) public {
    _burn(_from, _amount);
  }
}
