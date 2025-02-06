import { useState } from "react";
import { usePrepareContractWrite, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json";

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("");

    // update Listing 
    const { config: updateConfig } = usePrepareContractWrite({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "updateListing",
        args: [nftAddress, tokenId, parseUnits(priceToUpdateListingWith || "0", 18)],
        enabled: !!priceToUpdateListingWith,
    });

    // Execute update Listing
    const { write: updateListing } = useWriteContract(updateConfig);

    // Handle success message
    async function handleUpdateListingSuccess(tx) {
        try {
            await tx.wait();
            alert("Listing updated! Please refresh.");
            setPriceToUpdateListingWith("");
            onClose && onClose();
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    }

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Update Listing</h2>
                <input
                    type="number"
                    placeholder="New price in ETH"
                    value={priceToUpdateListingWith}
                    onChange={(event) => setPriceToUpdateListingWith(event.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            updateListing?.({
                                onSuccess: handleUpdateListingSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                        disabled={!updateListing}
                        className={`px-4 py-2 rounded transition ${
                            updateListing
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
