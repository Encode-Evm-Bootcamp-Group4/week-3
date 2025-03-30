import { createPublicClient, http, Address } from "viem";
import { sepolia } from "viem/chains";
import { abi as ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { abi as tokenAbi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const ballotAddress = process.env.TOKENIZEDBALLOT_ADDRESS || "";
const tokenAddress = process.env.MYTOKEN_ADDRESS || "";

async function main() {
    // Setup client
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // Get target block number
    const targetBlockNumber = await publicClient.readContract({
        address: ballotAddress as Address,
        abi: ballotAbi,
        functionName: 'targetBlockNumber',
    }) as bigint;

    console.log("\nTarget Block Number:", targetBlockNumber.toString());

    // Query all proposals
    let proposalIndex = 0;
    const proposals: any[] = [];
    
    while (true) {
        try {
            const proposal = await publicClient.readContract({
                address: ballotAddress as Address,
                abi: ballotAbi,
                functionName: 'proposals',
                args: [BigInt(proposalIndex)],
            }) as [string, bigint];

            proposals.push({
                index: proposalIndex,
                name: proposal[0],
                voteCount: proposal[1].toString()
            });
            
            proposalIndex++;
        } catch (error) {
            // Break the loop at end of proposals
            break;
        }
    }

    // Get winning proposal info
    const winningProposalIndex = await publicClient.readContract({
        address: ballotAddress as Address,
        abi: ballotAbi,
        functionName: 'winningProposal',
    }) as bigint;

    const winnerName = await publicClient.readContract({
        address: ballotAddress as Address,
        abi: ballotAbi,
        functionName: 'winnerName',
    }) as string;

    // Print results
    console.log('\nAll proposals:');
    proposals.forEach(proposal => {
        console.log(`Proposal ${proposal.index}: "${proposal.name}" with ${proposal.voteCount} votes`);
    });

    console.log('\nWinning proposal:', {
        index: winningProposalIndex.toString(),
        name: winnerName
    });

    // If voter addresses provided as arguments, check their voting power
    const voterAddresses = process.argv.slice(2);
    if (voterAddresses.length > 0) {
        console.log('\nVoter Information:');
        for (const voter of voterAddresses) {
            const votePowerSpent = await publicClient.readContract({
                address: ballotAddress as Address,
                abi: ballotAbi,
                functionName: 'votePowerSpent',
                args: [voter as Address],
            }) as bigint;

            const remainingVotePower = await publicClient.readContract({
                address: ballotAddress as Address,
                abi: ballotAbi,
                functionName: 'getRemainingVotingPower',
                args: [voter as Address],
            }) as bigint;

            const pastVotes = await publicClient.readContract({
                address: tokenAddress as Address,
                abi: tokenAbi,
                functionName: 'getPastVotes',
                args: [voter as Address, targetBlockNumber],
            }) as bigint;

            console.log(`\nVoter ${voter}:`);
            console.log(`- Total voting power at target block: ${pastVotes.toString()}`);
            console.log(`- Voting power spent: ${votePowerSpent.toString()}`);
            console.log(`- Remaining voting power: ${remainingVotePower.toString()}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
