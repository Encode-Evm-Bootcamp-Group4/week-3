import { createPublicClient, http, createWalletClient, parseEther, Address, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = parseEther("10");
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const acc2Address = process.env.ACCOUNT2_ADDRESS || ""; 

async function main() {
    // Setup clients
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // Setup wallet client for deployer/acc1
    const deployerAccount = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
        account: deployerAccount,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // Deploy contract
    console.log("\nDeploying MyToken contract");
    const hash = await deployer.deployContract({
        abi,
        bytecode: bytecode as `0x${string}`,
        args: [],
    });
    console.log("Transaction hash:", hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const contractAddress = receipt.contractAddress as Address;
    console.log("MyToken contract deployed to:", contractAddress);

    // Create contract instance
    const contract = getContract({
        address: contractAddress,
        abi,
        client: publicClient,
    });

    const writeContract = getContract({
        address: contractAddress,
        abi,
        client: deployer,
    });

    // Mint tokens to deployer (acc1)
    const mintTx = await writeContract.write.mint([deployer.account.address, MINT_VALUE] as const);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(`Minted ${MINT_VALUE.toString()} tokens to ${deployer.account.address}`);

    // Delegate voting power for deployer (acc1)
    const delegateTx = await writeContract.write.delegate([deployer.account.address] as const);
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([deployer.account.address]) as bigint;
    console.log(
        `Account ${deployer.account.address} has ${votesAfter.toString()} units of voting power after self delegating\n`
    );

    // Transfer tokens to acc2
    const transferTx = await writeContract.write.transfer([
        acc2Address,
        MINT_VALUE / 2n
    ] as const);
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    console.log(`Transferred ${(MINT_VALUE / 2n).toString()} tokens to ${acc2Address}\n`);

    console.log("Contract address for acc2 to use:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});