// TODO: modify this so it deploys with viem and add addresses 

import { viem } from "hardhat";
import { parseEther } from "viem";

const MINT_VALUE = parseEther("10");

async function main() {
    // from lesson 12, testvotetoken.ts
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyToken");
    console.log(`Token contract deployed at ${contract.address}\n`);

    // Mint and distribute tokens
    const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(`Minted ${MINT_VALUE.toString()} tokens to ${acc1.account.address}`);
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account ${acc1.account.address
        }\n`
    );
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(
        `Account ${acc1.account.address
        } has ${balanceBN.toString()} decimal units of MyToken\n`
    );

    // Check voting power
    // Before self-delegating, still have 0 units of voting power. Need to activate the checkpoint in order to have voting power 
    const votes = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account ${acc1.account.address
        } has ${votes.toString()} units of voting power before self delegating\n`
    );

    // Delegate voting power
    const delegateTx = await contract.write.delegate([acc1.account.address], {
        account: acc1.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account ${acc1.account.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    );


    // Transfer some tokens to acc2
    const transferTx = await contract.write.transfer(
        [acc2.account.address, MINT_VALUE / 2n],
        {
            account: acc1.account,
        }
    );
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    const votes1AfterTransfer = await contract.read.getVotes([
        acc1.account.address,
    ]);
    console.log(
        `Account ${acc1.account.address
        } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
    );
    const votes2AfterTransfer = await contract.read.getVotes([
        acc2.account.address,
    ]);
    console.log(
        `Account ${acc2.account.address
        } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
    );

    // Delegate voting power for acc2
    const delegateTx2 = await contract.write.delegate([acc2.account.address], {
        account: acc2.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter2 = await contract.read.getVotes([acc2.account.address]);
    console.log(
        `Account ${acc2.account.address
        } has ${votesAfter2.toString()} units of voting power after self delegating\n`
    );
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});