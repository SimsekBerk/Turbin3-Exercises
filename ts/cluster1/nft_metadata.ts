import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/Ou7QSjf8KPncnlytEZTLnea5sPKFznJ3RmWZPmrg1Ak";
        const metadata = {
            name: "Ric's rug",
            symbol: "RIC",
            description: "After the rug, builder get blind. All cost is a 5k dollar, that cost include the hospital costs.",
            image,
            attributes: [
                {trait_type: "Seller Ric", value: '5'},
                {trait_type: "Color", value: 'Purple'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image,
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("URI: ", myUri);
        // https://arweave.net/-o92lw98_GZni0n5H1hJwZ71hJBNGedw6ERoiWAWr9o
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();