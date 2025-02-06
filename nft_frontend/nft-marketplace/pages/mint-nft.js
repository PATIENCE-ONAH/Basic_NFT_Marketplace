import { useState } from "react";
import { useWriteContract, usePrepareContractWrite } from "wagmi";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json"; 


export default function MintNFT({ marketplaceAddress }) {
    const [tokenURI, setTokenURI] = useState("");
    const [minting, setMinting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // mint NFT using nftMarketplaceAbi
    const { config: mintConfig } = usePrepareContractWrite({
        address: marketplaceAddress, 
        abi: nftMarketplaceAbi,
        functionName: "mintNFT",
        args: [tokenURI],
        enabled: !!tokenURI,
    });

    const { write: mintNFT } = useWriteContract(mintConfig);

    const handleMint = async () => {
        if (!mintNFT) return;
        setMinting(true);
        setSuccessMessage("");
        try {
            const tx = await mintNFT();
            await tx.wait();
            setSuccessMessage("NFT Minted Successfully! 🎉");
            setTokenURI(""); 
        } catch (error) {
            console.error("Minting failed:", error);
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mint Your NFT</h2>
            <input
                type="text"
                placeholder="Enter Token URI"
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
                onClick={handleMint}
                className={`w-full py-2 rounded text-white ${
                    mintNFT
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!mintNFT || minting}
            >
                {minting ? "Minting..." : "Mint NFT"}
            </button>
            {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
        </div>
    );
}
