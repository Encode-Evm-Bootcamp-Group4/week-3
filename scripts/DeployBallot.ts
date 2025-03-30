import { createPublicClient, http, createWalletClient, formatEther, toHex, Address} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const proposals = process.argv.slice(2);
  if (proposals.length < 2)
    throw new Error("Parameters not provided. Expected: proposals... tokenContractAddress");
  
  // Get token contract address (last argument)
  const tokenContractAddress = proposals.pop() as Address;
  
  if (proposals.length < 1)
    throw new Error("Proposals not provided");

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Current block number:", blockNumber);
  // Using block number - 1 as target block number (must be in the past)
  const targetBlockNumber = blockNumber - 1n;

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
  console.log("\nDeploying TokenizedBallot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      tokenContractAddress,
      targetBlockNumber
    ],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("TokenizedBallot contract deployed to:", receipt.contractAddress);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

  