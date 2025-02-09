import { readContracts } from "@wagmi/core";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json";
import networkMapping from "@/constants/networkMapping.json";


export async function fetchListedNFTs() {
    try {
        const chainId  =  31337
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
        const data = await readContracts({
            contracts: [
                {
                    address: marketplaceAddress,
                    abi: nftMarketplaceAbi,
                    functionName: "getListing", 
                    args: [],
                },
            ],
        });

        return data[0]; 
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        return [];
    }
}
