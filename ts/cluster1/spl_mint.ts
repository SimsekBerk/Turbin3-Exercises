import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("3QzX6hDbcEHBkbta9MBEVLk88KV5MmnZsuwic2A1W2MG");

(async () => {
    try {
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint,keypair.publicKey);
        console.log(`ata address: ${ata.address.toBase58()}`);

        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, BigInt(100) * token_decimals);
        console.log(`mint tx id: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// ata address: ELGC2DWcXkddZwBKZ7N13XPMUfhMpqCFoByV2xChSQPi
// mint tx id: 2fCufh1HHAYrx7KkZyB8V3ccjDuqHhvTUYe7CyyFTDy7UhPJ2hbqzzV5TknKidaLhNcttXXF3EW38D1tvUMzcLGp