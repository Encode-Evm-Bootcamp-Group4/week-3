# Week 3 Homework Results

### Contract Deployments and Transactions

1. **Token Distribution (TokenDistribution.ts)**
   - MyToken Contract Deployment:
     - Contract Address: `0x4ec94ebd3ab2499b8d3b42fcb7f4c98cc41cffb5`
     - Transaction Hash: `0xe50a37bb6a998007fe05a4214271699e7b84c0a4fe42f52078d039b4a1545f03`
   - Initial Minting:
     - Amount: 10000000000000000000 tokens to Account 1
     - Self-delegation: Account 1 received 10000000000000000000 voting power
   - Token Transfer to Account 2:
     - Approval Tx Hash: `0xe2fe3350221735ffe824f275ad55d0d42a1b3aaf7a822e8b5affb4f30174df43`
     - Transfer Tx Hash: `0xf0e8e3cd29c0a3d774ec1cea4721f61b3fa27b0ad6356bd4363d4f6d5eca1210`
     - Amount: 5000000000000000000 tokens
   - Final Balances:
     - Account 1: 5000000000000000000 tokens
     - Account 2: 5000000000000000000 tokens

2. **Account 2 Delegation (Acc2Delegation.ts)**
   - Initial State:
     - Balance: 5000000000000000000 tokens
     - Voting Power: 0
   - After Self-delegation:
     - Voting Power: 5000000000000000000
   - Total Supply: 10000000000000000000 tokens

3. **Ballot Deployment (DeployBallot.ts)**
   - Contract Address: `0x62c1d30c8be411661e870430793524a75361acba`
   - Transaction Hash: `0xf5d08bee60f721ee0d2edff0211a27cea28f58d83fb4f6e1f262dbf70a5b99f6`
   - Target Block: 8016485
   - Deployer: `0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30`
   - Proposals: ["Proposal1", "Proposal2", "Proposal3"]

4. **Voting Transactions**
   - Account 1 Vote:
     - Proposal Index: 2 (Proposal3)
     - Transaction Hash: `0x02842137181f5c2bf1b5b1f91f54d6091c1909e86b6fb6f7bf35d9b777465db4`
     - Block Confirmed: 8016490
     - Voting Power Used: 5000000000000000000
   
   - Account 2 Vote:
     - Proposal Index: 1 (Proposal2)
     - Transaction Hash: `0x63c1b4d65d527728e5624e40889236a461232844b66ab6df85b65928c0340e18`
     - Block Confirmed: 8016496
     - Voting Power Used: 5000000000000000000

5. **Final Results (QueryResults.ts)**
   Target Block: 8016484
   
   Proposal Votes:
   - Proposal1: 0 votes
   - Proposal2: 5000000000000000000 votes
   - Proposal3: 5000000000000000000 votes
   
   Winning Proposal: Proposal2 (index 1)

   Voter Status:
   - Account 1 (`0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30`):
     - Total Voting Power: 5000000000000000000
     - Power Spent: 5000000000000000000
     - Remaining: 0
   
   - Account 2 (`0x4a1Cf67D979Cb8c97A3D7a7155D306f8078800c7`):
     - Total Voting Power: 5000000000000000000
     - Power Spent: 5000000000000000000
     - Remaining: 0

### Environment Setup
Create a `.env` file with:
```
ALCHEMY_API_KEY=your_api_key
PRIVATE_KEY=your_private_key
ACC2_PRIVATEKEY=account2_private_key
ACCOUNT1_ADDRESS=0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30
ACCOUNT2_ADDRESS=0x4a1Cf67D979Cb8c97A3D7a7155D306f8078800c7
MYTOKEN_ADDRESS=0x4ec94ebd3ab2499b8d3b42fcb7f4c98cc41cffb5
TOKENIZEDBALLOT_ADDRESS=0x62c1d30c8be411661e870430793524a75361acba
```

### Script Execution Commands
```bash
# 1. Deploy token and distribute
npx hardhat run ./scripts/TokenDistribution.ts

# 2. Setup Account 2 delegation
npx hardhat run ./scripts/Acc2Delegation.ts

# 3. Deploy ballot with proposals
PROPOSALS=Proposal1,Proposal2,Proposal3 npx hardhat run ./scripts/DeployBallot.ts

# 4. Cast votes
PROPOSAL_INDEX=2 npx hardhat run ./scripts/CastVote.ts  # Account 1 vote
PROPOSAL_INDEX=1 npx hardhat run ./scripts/CastVote.ts  # Account 2 vote

# 5. Query results
npx ts-node scripts/QueryResults.ts <VOTER_ADDRESS>