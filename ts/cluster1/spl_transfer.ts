import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("3QzX6hDbcEHBkbta9MBEVLk88KV5MmnZsuwic2A1W2MG");

// Recipient address
const to = new PublicKey("6qhxhsZoyKHSGcXUKb1vhUjhaVrj2u5cybdAxZZ6Pv2h");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            1e6
        );
        console.log(`txid: ${tx}`);
        // txid: 299mRvPB1dpLWtCKrKPD2meukjknH6v7qiCvhRRTonPk6YGk6E3y6CJvE4Je2jpd2zScifMegwoP6JV7r9tmFTh7
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();