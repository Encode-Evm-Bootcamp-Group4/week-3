import { createPublicClient, http, createWalletClient, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const acc2PrivateKey = process.env.PRIVATE_KEY || ""; // acc2 will use their private key
const contractAddress = process.env.CONTRACT_ADDRESS || ""; // Will need to be provided by deployer

async function main() {
    // Setup clients
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // Setup wallet client for acc2
    const acc2Account = privateKeyToAccount(`0x${acc2PrivateKey}`);
    const acc2 = createWalletClient({
        account: acc2Account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // Create contract instance for acc2
    const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi,
        publicClient,
        walletClient: acc2,
    });

    // Check initial balance
    const balanceBN = await contract.read.balanceOf([acc2.account.address] as const);
    console.log(
        `Initial balance for ${acc2.account.address}: ${balanceBN.toString()} tokens\n`
    );

    // Check voting power before delegation
    const votesBefore = await contract.read.getVotes([acc2.account.address] as const);
    console.log(
        `Account ${acc2.account.address} has ${votesBefore.toString()} units of voting power before self delegating\n`
    );

    // Delegate voting power
    const delegateTx = await contract.write.delegate([acc2.account.address] as const);
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([acc2.account.address] as const);
    console.log(
        `Account ${acc2.account.address} has ${votesAfter.toString()} units of voting power after self delegating\n`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});