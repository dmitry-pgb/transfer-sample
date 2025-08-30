require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const IJS_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)"
];

const IJS_ADDRESS = process.env.IJS_TOKEN_ADDRESS;
const ijsContract = new ethers.Contract(IJS_ADDRESS, IJS_ABI, wallet);

async function sendETH(to, amountETH) {
    const tx = await wallet.sendTransaction({
        to: to,
        value: ethers.parseEther(amountETH)
    });
    console.log("ETH Transaction Hash:", tx.hash);
    await tx.wait();
    console.log("ETH Transaction Confirmed!");
}

async function sendIJS(to, amountTokens) {
    // amountTokens should be in token's smallest unit (wei for ETH, decimals for token)
    const decimals = 18; // Replace with your token's decimals
    const amount = ethers.parseUnits(amountTokens, decimals);

    const tx = await ijsContract.transfer(to, amount);
    console.log("IJS Transaction Hash:", tx.hash);
    await tx.wait();
    console.log("IJS Transaction Confirmed!");
}

// Example usage
(async () => {
    const recipient = "0xA455CB036Ad0047D7023328C7aaeC44Ee572BBd9";

    // await sendETH(recipient, "0.01"); // 0.01 ETH
    await sendIJS(recipient, "200");  // 100 IJS tokens
})();