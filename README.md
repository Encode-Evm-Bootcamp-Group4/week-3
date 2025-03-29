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
1. Run `TokenDistribution.ts` to deploy the token and distribute voting power
2. Copy the token address and paste it into `DeployBallotAndVote.ts`
3. Run the second script to deploy the ballot and cast votes 
4. Copy the ballot address and paste it into `QueryResults.ts`
5. Run the third script to query results