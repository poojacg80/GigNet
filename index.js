"use strict";
const express = require('express');
const app = express()
const port = 6000

const Web3 = require('web3')
var Tx     = require('ethereumjs-tx')
const rpcURL = 'http://127.0.0.1:18888/rpc' // Your PRC URL goes here
const web3 = new Web3(rpcURL)


app.get('/getBalance', (req, res) => {
  const address = req.query.address;
//'0x2E833968E5bB786Ae419c4d13189fB081Cc43bab' // Your account address goes here
web3.eth.getBalance(address, (err, wei) => { balance = web3.utils.fromWei(wei, 'ether') }).then(
    function(result) {
        console.log("Address:", address)
        console.log("TFuelWei Balance:", result)
     }
)

})

app.get('/send_signed_transaction', (req, res) => {
const chainID = 366 // for the local privatenet

const account1 = req.query.account1;
  //'0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A' // Your account address 1
const account2 = req.query.account2;
  //'0x1563915e194D8CfBA1943570603F7606A3115508' // Your account address 2

const privateKey1 = Buffer.from(req.qeury.pk1, 'hex')
const privateKey2 = Buffer.from(req.query.pk2, 'hex')

web3.eth.getTransactionCount(account1, (err, txCount) => {
  console.log(txCount)

  // Build the transaction
  const txObject = {
    nonce:    web3.utils.toHex(txCount),
    to:       account2,
    value:    web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('4000', 'gwei')),
    chainId: chainID
  }

  // Sign the transaction
  const tx = new Tx(txObject)
  tx.sign(privateKey1)

  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')

  // Broadcast the transaction
  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log('txHash:', txHash);
    res.send('txHash:', txHash);
    // Now go check etherscan to see the transaction!
  })
})

})

app.get('/send_tnt20_token_mainnet', (req, res) => {
const web3 = new Web3('https://eth-rpc-api.thetatoken.org/rpc')
const chainID = 361 // for the Theta Mainnet

// Variables definition
const senderPrivKey = req.qeury.senderPrivKey;
  //'1111111111111111111111111111111111111111111111111111111111111111'
const senderAddr    = req.query.senderAddr;
  //"0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A"
const recipientAddr = req.query.recipientAddr;
  //"0x1563915e194D8CfBA1943570603F7606A3115508"

const tdropContractAddress = "0x1336739B05C7Ab8a526D40DCC0d04a826b5f8B03";
const abi = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"uint256","name":"initialSupply_","type":"uint256"},{"internalType":"bool","name":"mintable_","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
const contract = new web3.eth.Contract(abi, tdropContractAddress)

// Create transaction
const sendTDrop = async(tdropAmountInWei) => {
   console.log(`Attempting to send ${tdropAmountInWei} wei of TDROP from ${senderAddr} to ${recipientAddr}`);
  
   const count = await web3.eth.getTransactionCount(senderAddr);
   const createTransaction = await web3.eth.accounts.signTransaction({
        "from": senderAddr,
        "nonce": web3.utils.toHex(count),
        "gas": web3.utils.toHex(150000),
        "to": tdropContractAddress,
        "data": contract.methods.transfer(recipientAddr, tdropAmountInWei).encodeABI()
      },
      senderPrivKey
   );

   // Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );

   console.log("");
   console.log("Transaction successful with hash:", createReceipt.transactionHash);
   console.log("");
   console.log("Transaction details:", JSON.stringify(createReceipt, null, "  "));
  res.send("Transaction details:", JSON.stringify(createReceipt, null, "  "));
};

const tdropAmountInWei = "100" // Sending 100 wei of TDROP (TDROP has 18 decimals)
sendTDrop(tdropAmountInWei)

})

app.get('/web3_extras', (req, res) => {
const web3 = new Web3('http://127.0.0.1:18888/rpc')

// Get average gas price in wei from last few blocks median gas price
web3.eth.getGasPrice().then((result) => {
  console.log(web3.utils.fromWei(result, 'ether'));
  res.send(web3.utils.fromWei(result, 'ether'));
})

// Use sha256 Hashing function
console.log(web3.utils.sha3('Dapp University'))

// Use keccak256 Hashing function (alias)
console.log(web3.utils.keccak256('Dapp University'))

// Get a Random Hex
console.log(web3.utils.randomHex(32))


})


app.get('/Contract_deploy', (req, res) => {
const web3 = new Web3('http://127.0.0.1:18888/rpc')
const chainID = 366 // for the local privatenet

const account1 = req.query.acc1;
  //'0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A' // Your account address 1
const account2 = req.query.acc2; //'0x1563915e194D8CfBA1943570603F7606A3115508' // Your account address 2

const privateKey1 = Buffer.from(req.query.pk1, 'hex')
const privateKey2 = Buffer.from(req.query.pk2, 'hex')

// Deploy the contract
web3.eth.getTransactionCount(account1, (err, txCount) => {
  const data = '0x60806040526040805190810160405280600a81526020017f4441707020546f6b656e000000000000000000000000000000000000000000008152506000908051906020019061004f92919061014e565b506040805190810160405280600481526020017f44415050000000000000000000000000000000000000000000000000000000008152506001908051906020019061009b92919061014e565b506040805190810160405280600f81526020017f4441707020546f6b656e2076312e300000000000000000000000000000000000815250600290805190602001906100e792919061014e565b503480156100f457600080fd5b506000620f4240905080600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555080600381905550506101f3565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061018f57805160ff19168380011785556101bd565b828001600101855582156101bd579182015b828111156101bc5782518255916020019190600101906101a1565b5b5090506101ca91906101ce565b5090565b6101f091905b808211156101ec5760008160009055506001016101d4565b5090565b90565b610b99806102026000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde031461009e578063095ea7b31461012e57806318160ddd1461019357806323b872dd146101be5780635a3b7e421461024357806370a08231146102d357806395d89b411461032a578063a9059cbb146103ba578063dd62ed3e1461041f575b600080fd5b3480156100aa57600080fd5b506100b3610496565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100f35780820151818401526020810190506100d8565b50505050905090810190601f1680156101205780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561013a57600080fd5b50610179600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610534565b604051808215151515815260200191505060405180910390f35b34801561019f57600080fd5b506101a8610626565b6040518082815260200191505060405180910390f35b3480156101ca57600080fd5b50610229600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061062c565b604051808215151515815260200191505060405180910390f35b34801561024f57600080fd5b5061025861089b565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561029857808201518184015260208101905061027d565b50505050905090810190601f1680156102c55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156102df57600080fd5b50610314600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610939565b6040518082815260200191505060405180910390f35b34801561033657600080fd5b5061033f610951565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561037f578082015181840152602081019050610364565b50505050905090810190601f1680156103ac5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156103c657600080fd5b50610405600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506109ef565b604051808215151515815260200191505060405180910390f35b34801561042b57600080fd5b50610480600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b48565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561052c5780601f106105015761010080835404028352916020019161052c565b820191906000526020600020905b81548152906001019060200180831161050f57829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60035481565b6000600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561067c57600080fd5b600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561070757600080fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109315780601f1061090657610100808354040283529160200191610931565b820191906000526020600020905b81548152906001019060200180831161091457829003601f168201915b505050505081565b60046020528060005260406000206000915090505481565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109e75780601f106109bc576101008083540402835291602001916109e7565b820191906000526020600020905b8154815290600101906020018083116109ca57829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610a3f57600080fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b60056020528160005260406000206020528060005260406000206000915091505054815600a165627a7a723058204c3f690997294d337edc3571d8e77afc5b0e56a2f4bfae6fb59139c8e4eb2f7e0029'

  const txObject = {
    nonce:    web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
    gasPrice: web3.utils.toHex(web3.utils.toWei('4000', 'gwei')),
    data: data,
    chainId: chainID
  }

  const tx = new Tx(txObject)
  tx.sign(privateKey1)

  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')

  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log('err:', err, 'txHash:', txHash);
    //res.send('err:', err, 'txHash:', txHash);
    // Use this txHash to find the contract on Etherscan!
  })
})
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
