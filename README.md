# Week 3 Homework Solution

## TestVoteToken.ts
Script to demonstrate token with voting capabilities: delegation, transfer effects on voting power, and historical voting power queries. 

### Test Flow

1. **Setup**
   - Deploys a "MyToken" contract
   - Gets three accounts: deployer, acc1, and acc2

2. **Initial Token Distribution**
   - Mints 10 tokens to acc1
   - Checks acc1's balance

3. **Voting Power Demonstration**
   - Initially acc1 has 0 voting power despite having tokens
   - Voting power must be activated through delegation
   - acc1 self-delegates to get voting power equal to their token balance

4. **Transfer Effects**
   - acc1 transfers half their tokens to acc2
   - Shows how transfer affects voting power:
     - acc1's voting power decreases
     - acc2 has no voting power yet (needs to self-delegate)
     - acc2 then self-delegates to activate their voting power

5. **Historical Voting Power**
   - Demonstrates querying past voting power at different block numbers
   - Useful for governance snapshots
   - Shows how voting power changed over time

### Example Output
```
Minted 10000000000000000000 decimal units to account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has 10000000000000000000 decimal units of MyToken

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has 0 units of voting power before self delegating

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has 10000000000000000000 units of voting power after self delegating

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has 5000000000000000000 units of voting power after transferring

Account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc has 0 units of voting power after receiving a transfer

Account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc has 5000000000000000000 units of voting power after self delegating

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 had 5000000000000000000 units of voting power at block 4

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 had 10000000000000000000 units of voting power at block 3

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 had 0 units of voting power at block 2

Account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 had 0 units of voting power at block 1
```

### Contract/Scripts Interaction Flow
1. **Token Distribution & Initial Setup**
   - Run `TokenDistribution.ts` to:
     - Deploy the token contract
     - Mint tokens to deployer (acc1)
     - Self-delegate acc1's voting power
     - Transfer tokens to acc2
     - Note down the contract address output

2. **Account 2 Setup**
   - Set the contract address in your `.env` file
   - Run `Acc2Delegation.ts` to:
     - Check acc2's token balance
     - Self-delegate acc2's voting power

3. **Ballot Deployment**
   - Run `DeployBallot.ts` with:
     ```bash
     npx ts-node scripts/DeployBallot.ts "Proposal 1" "Proposal 2" "Proposal 3" <token-contract-address>
     ```
   - Note down the ballot contract address output

4. **Voting**
   - Use `CastVote.ts` to vote on proposals
   - Each account can vote with their available voting power

5. **Query Results**
   - Run `QueryResults.ts` to:
     - Check remaining voting power
     - View proposal vote counts
     - See winning proposal
     - Query historical voting power

### Environment Setup
Create a `.env` file with:
```
ALCHEMY_API_KEY=your_api_key
PRIVATE_KEY=your_private_key
ACCOUNT2_ADDRESS=address_of_account_2
CONTRACT_ADDRESS=deployed_token_address
```

## Report on Script Results

- npx hardhat run ./scripts/TokenDistribution.ts

Deploying MyToken contract
Transaction hash: 0x9e570984ec0d5bda18043fbe863117d5757f0465ebd30788ec0862a1b3ea4c7a
MyToken contract deployed to: 0xda2960ca1daad3700d6a7a09df998d51538c74ab
Minted 10000000000000000000 tokens to 0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30
Account 0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30 has 10000000000000000000 units of voting power after self delegating

Transferred 5000000000000000000 tokens to 0x4be7F17291d3194b33edE62D177B5294234d8AA2

Contract address for acc2 to use: 0xda2960ca1daad3700d6a7a09df998d51538c74ab

