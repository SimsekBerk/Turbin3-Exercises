import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("3QzX6hDbcEHBkbta9MBEVLk88KV5MmnZsuwic2A1W2MG")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        const metadataPda = await findMetadataPda(umi, { mint });
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata: metadataPda,
            mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer.publicKey
        }

        let data: DataV2Args = {
            name: "0xRic",
            symbol: "RIC",
            uri: "",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        );

        let result = await tx.sendAndConfirm(umi);
        // tx id : oeu3mMka29xET6weNDQKsTa12GfRtCn8pGoMp3EVkNWthNR8zbVVAXomSviz4QkwpRBKAQx19MdSRUvP4zB5coN
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();