// TODO: modify this script from previous ballot homework so that it matches tokenized ballot contract

// import { createPublicClient, http, createWalletClient, Address } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { sepolia } from "viem/chains";
// import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
// import * as dotenv from "dotenv";
// dotenv.config();

// const providerApiKey = process.env.ALCHEMY_API_KEY || "";
// const voterPrivateKey = process.env.PRIVATE_KEY || "";
// const contractAddress = process.env.CONTRACT_ADDRESS || "";

// async function main() {

//   const proposalIndex = process.argv[2];
//   if (!proposalIndex) throw new Error("Proposal index not provided");

//   // Setup clients
//   const publicClient = createPublicClient({
//     chain: sepolia,
//     transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
//   });

//   const account = privateKeyToAccount(`0x${voterPrivateKey}`);
//   const walletClient = createWalletClient({
//     account,
//     chain: sepolia,
//     transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
//   });

//   // Check if the voter has rights
//   const voter = await publicClient.readContract({
//     address: contractAddress as Address,
//     abi,
//     functionName: 'voters',
//     args: [account.address],
//   }) as [bigint, boolean, string, bigint];

//   console.log('Voter status:', {
//     address: account.address,
//     weight: voter[0].toString(),
//     voted: voter[1],
//     delegate: voter[2],
//     vote: voter[3].toString()
//   });

//   if (!voter[0]) {
//     throw new Error(`Account ${account.address} does not have voting rights`);
//   }

//   if (voter[1]) {
//     throw new Error(`Account ${account.address} has already voted`);
//   }

//   console.log(`Casting vote for proposal ${proposalIndex}...`);
//   console.log(`Using contract at address: ${contractAddress}`);
  
//   // Cast vote
//   const hash = await walletClient.writeContract({
//     address: contractAddress as Address,
//     abi,
//     functionName: 'vote',
//     args: [BigInt(proposalIndex)],
//   });

//   console.log("Transaction hash:", hash);
//   const receipt = await publicClient.waitForTransactionReceipt({ hash });
//   console.log("Transaction confirmed in block:", receipt.blockNumber);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });