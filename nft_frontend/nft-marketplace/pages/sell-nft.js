import styles from "@/styles/Home.module.css"
import { useAccount, useReadContract, useWriteContract, usePrepareContractWrite} from "wagmi";
import { parseUnits } from "viem";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import networkMapping from "@/constants/networkMapping.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { address, isConnected } = useAccount();
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const [proceeds, setProceeds] = useState("0")

    const { data: returnedProceeds } = useReadContract({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "getProceeds",
        args: [address],
        enabled: isConnected,
    });

    useEffect(() => {
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString());
        }
    }, [returnedProceeds]);

    
    const { config: listConfig } = usePrepareContractWrite({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "listNFT",
        args: [nftAddress, tokenId, parseUnits(price, 18)],

    });

    const { write: listNFT } = useWriteContract(listConfig);

    const { config: withdrawConfig } = usePrepareContractWrite({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "withdrawProceeds",
    });
    
    const { write: withdrawProceeds } = useWriteContract(withdrawConfig);

    async function handleListSuccess(tx) {
        try {
            await tx.wait();
            alert("NFT successfully listed!");
            console.log("NFT listed successfully!");
        } catch (error) {
            console.error("Error waiting for transaction:", error);
        }
    }

    async function handleWithdrawSuccess(tx) {
        try {
            await tx.wait();
            alert("Proceeds successfully withdrawn!");
            setProceeds("0");
            console.log("Withdrawal successful!");
        } catch (error) {
            console.error("Error waiting for withdrawal transaction:", error);
        }
    }

    function handleList(e) {
        e.preventDefault();
        listNFT?.({
            args: [nftAddress, tokenId, parseUnits(price, 18)],
            onSuccess: handleListSuccess,
        });
                
    }

    return (
        <div className={styles.container}>
                    <form onSubmit={handleList}>
                <input 
                    type="text" 
                    placeholder="NFT Address" 
                    value={nftAddress} 
                    onChange={(e) => setNftAddress(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder="Token ID" 
                    value={tokenId} 
                    onChange={(e) => setTokenId(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Price in ETH" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                />
                <button type="submit">List NFT</button>     
                    </form>

                    <div>Withdraw {proceeds} proceeds</div>
            {proceeds !== "0" ? (
                <button onClick={() => withdrawProceeds?.({ onSuccess: handleWithdrawSuccess })}>
                    Withdraw
                </button>
            ) : (
                        <div>No proceeds detected</div>
                    )}
        </div>
    );
}

    