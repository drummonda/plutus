# Plutus
By: Andrew Drummond
=======
# Overview

Plutus is a peer-to-peer lending platform, built on Ethereum, using a native utility token: PeerToken (PTK). The platform allows for lenders and lendees to purchase PeerTokens using ETH. Once PTK is acquired, lenders and lendees can conduct interaction via loans that are represented as smart contracts -- lenders can pool money together into a loan, set rules and a recipient, and then 'launch' the loan and let it work its decentralized, automated magic.

Once a loan is launched, the lendee receives payments that make up the loan in the form of PTK, and after a certain period of time are required to pay back PTK to the loan contract, at risk of lowering their blockchain-based credit score. Any time a user makes an interest or bulk payment, the payment is distributed pro-rata to any investors in the loan contract.


### Technical Details
The core boilerplate of this app was made using [Boilermaker](https://github.com/FullstackAcademy/boilermaker) Using React and Redux, the frontend of the site maintains a store shared by all components.

The app integrates with an ethereum ganache-cli blockchain on the backend, and uses Solidity smart contracts. In leiu of using Truffle, there is a 'scripts' folder for automated compilation and deployment of smart contracts for the project. The deployment script is designed to push a contract ABI and address on the blockchain to Google's firebase cloud storage, which the frontend of the application will pull to allow for working with web3.eth.Contract() instances.


### Installation
Using npm:
```
npm i
npm run test
npm run compile-contracts
npm run deploy-contracts
npm start
```
