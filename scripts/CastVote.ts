// TODO: modify this script from previous ballot homework so that it matches tokenized ballot contract

import { createPublicClient, http, createWalletClient, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi as ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { abi as tokenAbi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const voterPrivateKey = process.env.PRIVATE_KEY || "";
const ballotAddress = process.env.TOKENIZEDBALLOT_ADDRESS || "";
const tokenAddress = process.env.MYTOKEN_ADDRESS || "";

async function main() {
  const proposalIndex = process.env.PROPOSAL_INDEX;
  if (!proposalIndex) throw new Error("Proposal index not provided");

  // Setup clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = privateKeyToAccount(`0x${voterPrivateKey}`);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Get target block number from ballot contract
  const targetBlockNumber = await publicClient.readContract({
    address: ballotAddress as Address,
    abi: ballotAbi,
    functionName: 'targetBlockNumber',
  }) as bigint;

  // Get past voting power from token contract
  const pastVotingPower = await publicClient.readContract({
    address: tokenAddress as Address,
    abi: tokenAbi,
    functionName: 'getPastVotes',
    args: [account.address, targetBlockNumber],
  }) as bigint;

  console.log('Voter status:', {
    address: account.address,
    pastVotingPower: pastVotingPower.toString(),
    targetBlock: targetBlockNumber.toString()
  });

  if (pastVotingPower <= 0n) {
    throw new Error(`Account ${account.address} has no voting power at block ${targetBlockNumber}`);
  }

  console.log(`Casting vote for proposal ${proposalIndex}...`);
  console.log(`Using ballot contract at address: ${ballotAddress}`);
  
  // Cast vote using ballot contract
  const hash = await walletClient.writeContract({
    address: ballotAddress as Address,
    abi: ballotAbi,
    functionName: 'vote',
    args: [BigInt(proposalIndex), pastVotingPower],
  });

  console.log("Transaction hash:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});