import styles from "@/styles/Home.module.css"
import { useAccount, useReadContract, useWriteContract, usePrepareContractWrite} from "wagmi";
import { parseUnits } from "viem";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"
import networkMapping from "@/constants/networkMapping.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { address, isConnected } = useAccount();
    const chainId = 31337
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const [nftAddress, setNftAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [proceeds, setProceeds] = useState("0"); 

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

    
    const { write: listNFT } = useWriteContract({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "listNFT",
        args: [nftAddress, tokenId, parseUnits(price, 18)],

    });

    

    //const { write: listNFT } = useWriteContract(listConfig);

    const { write: withdrawProceeds} = useWriteContract({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "withdrawProceeds",
    });

    useEffect(() => {
        console.log("listNFT function:", listNFT);
        console.log("withdrawProceeds function:", withdrawProceeds);
    }, [listNFT, withdrawProceeds]);
    
    //const { write: withdrawProceeds } = useWriteContract(withdrawConfig);

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
            if (listNFT) {
                listNFT({
                    onSuccess: handleListSuccess,
                onError: (error) => console.error("Listing NFT failed:", error),

                });
               
            } else {
                console.error("ListNFT function not available");
            }

                
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

    
// import styles from "@/styles/Home.module.css";
// import { useAccount, useReadContract, useWriteContract, usePrepareContractWrite } from "wagmi";
// import { parseUnits } from "viem";
// import nftMarketplaceAbi from "@/constants/NftMarketplace.json";
// import networkMapping from "@/constants/networkMapping.json";
// import { useEffect, useState } from "react";

// export default function Home() {
//     // Get user connection status
//     const { address, isConnected } = useAccount();
    
//     // Chain and contract details
//     const chainId = 31337;
//     const chainString = chainId ? parseInt(chainId).toString() : "31337";
//     const marketplaceAddress = networkMapping[chainString]?.NftMarketplace?.[0];

//     // State variables for form inputs
//     const [nftAddress, setNftAddress] = useState("");
//     const [tokenId, setTokenId] = useState("");
//     const [price, setPrice] = useState("");
//     const [proceeds, setProceeds] = useState("0");

//     // Debugging logs
//     useEffect(() => {
//         console.log("isConnected:", isConnected);
//         console.log("User Address:", address);
//         console.log("Marketplace Address:", marketplaceAddress);
//     }, [isConnected, address, marketplaceAddress]);

//     // Fetch proceeds from contract
//     const { data: returnedProceeds } = useReadContract({
//         address: marketplaceAddress,
//         abi: nftMarketplaceAbi,
//         functionName: "getProceeds",
//         args: [address],
//         enabled: isConnected && Boolean(marketplaceAddress && address),
//     });

//     useEffect(() => {
//         if (returnedProceeds) {
//             setProceeds(returnedProceeds.toString());
//         }
//     }, [returnedProceeds]);

//     // Prepare contract calls
//     const { config: listConfig } = usePrepareContractWrite({
//         address: marketplaceAddress,
//         abi: nftMarketplaceAbi,
//         functionName: "listNFT",
//         args: [nftAddress, tokenId, parseUnits(price || "0", 18)],
//         enabled: nftAddress && tokenId && price, // Ensures args are valid before preparing
//     });

//     const { write: listNFT } = useWriteContract(listConfig);

//     const { config: withdrawConfig } = usePrepareContractWrite({
//         address: marketplaceAddress,
//         abi: nftMarketplaceAbi,
//         functionName: "withdrawProceeds",
//     });

//     const { write: withdrawProceeds } = useWriteContract(withdrawConfig);

//     // Handle listing success
//     async function handleListSuccess(tx) {
//         try {
//             await tx.wait();
//             alert("NFT successfully listed!");
//             console.log("NFT listed successfully!");
//         } catch (error) {
//             console.error("Error waiting for transaction:", error);
//         }
//     }

//     // Handle proceeds withdrawal
//     async function handleWithdrawSuccess(tx) {
//         try {
//             await tx.wait();
//             alert("Proceeds successfully withdrawn!");
//             setProceeds("0");
//             console.log("Withdrawal successful!");
//         } catch (error) {
//             console.error("Error waiting for withdrawal transaction:", error);
//         }
//     }

//     // Handle NFT listing
//     function handleList(e) {
//         e.preventDefault();
//         if (listNFT) {
//             listNFT();
//         } else {
//             console.error("ListNFT function not available");
//         }
//     }

//     return (
//         <div className={styles.container}>
//             <h1>NFT Marketplace</h1>
            
//             <form onSubmit={handleList}>
//                 <input 
//                     type="text" 
//                     placeholder="NFT Address" 
//                     value={nftAddress} 
//                     onChange={(e) => setNftAddress(e.target.value)} 
//                 />
//                 <input 
//                     type="number" 
//                     placeholder="Token ID" 
//                     value={tokenId} 
//                     onChange={(e) => setTokenId(e.target.value)} 
//                 />
//                 <input 
//                     type="text" 
//                     placeholder="Price in ETH" 
//                     value={price} 
//                     onChange={(e) => setPrice(e.target.value)} 
//                 />
//                 <button type="submit" disabled={!listNFT}>List NFT</button>     
//             </form>

//             <div>Withdraw {proceeds} proceeds</div>
//             {proceeds !== "0" ? (
//                 <button onClick={() => withdrawProceeds?.({ onSuccess: handleWithdrawSuccess })}>
//                     Withdraw
//                 </button>
//             ) : (
//                 <div>No proceeds detected</div>
//             )}
//         </div>
//     );
// }
