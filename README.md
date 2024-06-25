
# Blockchain Suppliers Payment

## Description

This project demonstrates a basic Hardhat use case, involving a smart contract that allows suppliers to create invoices and receive payments. It includes a sample contract, tests, and a Hardhat Ignition module for deployment.

## Requirements

- Node.js
- npm or yarn
- Hardhat
- Solidity

## Mode of Use

1. Clone the repository:
   ```bash
   git clone https://github.com/ferrerallan/blockchain-suppliers-payment.git
   ```

2. Navigate to the project directory:
   ```bash
   cd blockchain-suppliers-payment
   ```

3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```

5. Run the tests:
   ```bash
   npx hardhat test
   ```

6. Deploy the contracts:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/Lock.ts
   ```

## Folder Structure

- `contracts/`: Contains the Solidity smart contracts.
- `test/`: Contains test scripts for the contracts.
- `ignition/`: Contains Hardhat Ignition modules for deployment.
- `scripts/`: Contains scripts to interact with the deployed contracts.
