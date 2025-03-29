// TODO: this needs to be modified. it should query results + historical values of voting power after votes have been cast

// import { viem } from "hardhat";

// async function main() {
//     const [deployer, acc1, acc2] = await viem.getWalletClients();
//     const ballot = await viem.getContractAt(
//         "TokenizedBallot",
//         "PASTE_BALLOT_ADDRESS_HERE"
//     );

//     // Query voting power
//     const votePowerAcc1 = await ballot.read.getRemainingVotingPower([acc1.account.address]);
//     console.log(`Acc1 remaining voting power: ${votePowerAcc1.toString()}`);

//     const votePowerAcc2 = await ballot.read.getRemainingVotingPower([acc2.account.address]);
//     console.log(`Acc2 remaining voting power: ${votePowerAcc2.toString()}`);

//     // Query winning proposal
//     const winningProposal = await ballot.read.winningProposal();
//     const winnerName = await ballot.read.winnerName();
//     console.log(`Winning Proposal Index: ${winningProposal}`);
//     console.log(`Winner Name: ${winnerName}`);

//     // Query individual proposal votes
//     for (let i = 0; i < 3; i++) {
//         const proposal = await ballot.read.proposals([BigInt(i)]);
//         console.log(`Proposal ${i}: ${proposal.voteCount.toString()} votes`);
//     }

// // Past votes
// // U can pick historical values of voting power to bypass the block number as the parameter for retrieving the history of that person 
// // useful for snapshots 
// const lastBlockNumber = await publicClient.getBlockNumber();
// for (let index = lastBlockNumber - 1n; index > 0n; index--) {
//     const pastVotes = await contract.read.getPastVotes([
//         acc1.account.address,
//         index,
//     ]);
//     console.log(
//         `Account ${acc1.account.address
//         } had ${pastVotes.toString()} units of voting power at block ${index}\n`
//     );
// }

// }

// main().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// });