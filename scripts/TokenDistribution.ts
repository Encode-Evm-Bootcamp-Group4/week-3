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

    // Check balance before transfer
    const balanceBefore = await contract.read.balanceOf([deployer.account.address]) as bigint;
    console.log(`Deployer balance before transfer: ${balanceBefore.toString()}`);

    // Add validation for acc2Address
    if (!acc2Address || acc2Address === "") {
        throw new Error("ACCOUNT2_ADDRESS not set in environment variables");
    }

    // Validate acc2Address format
    if (!acc2Address.startsWith("0x") || acc2Address.length !== 42) {
        throw new Error("ACCOUNT2_ADDRESS must be a valid Ethereum address (0x... format, 42 characters long)");
    }

    // test approve
    console.log("Starting approve to acc2...");
    console.log(`Attempting to approve ${(MINT_VALUE / 2n).toString()} tokens to ${acc2Address}`);
    try {
        const approveTx = await writeContract.write.approve([
            acc2Address,
            MINT_VALUE / 2n
        ] as const);
        console.log("Transfer approveTx hash:", approveTx);
        const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveTx });
        if (approveReceipt.status === 'reverted') {
            throw new Error('approveTx transaction reverted');
        }
        console.log("Transfer successful!");
    } catch (error) {
        console.error("Transfer failed with error:", error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }
        throw error; // Re-throw to stop execution
    }

    // Transfer tokens to acc2
    console.log("Starting transfer to acc2...");
    console.log(`Attempting to transfer ${(MINT_VALUE / 2n).toString()} tokens to ${acc2Address}`);
    try {
        const transferTx = await writeContract.write.transfer([
            acc2Address,
            MINT_VALUE / 2n
        ] as const);
        console.log("Transfer transaction hash:", transferTx);
        const transferReceipt = await publicClient.waitForTransactionReceipt({ hash: transferTx });
        if (transferReceipt.status === 'reverted') {
            throw new Error('Transfer transaction reverted');
        }
        console.log("Transfer successful!");
    } catch (error) {
        console.error("Transfer failed with error:", error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }
        throw error; // Re-throw to stop execution
    }



    // Verify balances after
    const deployerBalance = await contract.read.balanceOf([deployer.account.address]) as bigint;
    const acc2Balance = await contract.read.balanceOf([acc2Address]) as bigint;
    console.log(`Deployer balance after: ${deployerBalance.toString()}`);
    console.log(`Acc2 balance after: ${acc2Balance.toString()}`);

    console.log("Contract address for acc2 to use:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});