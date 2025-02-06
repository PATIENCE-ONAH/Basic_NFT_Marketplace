import { useState, } from "react";
import { useAccount, useWriteContract, usePrepareContractWrite } from "wagmi";
import { parseUnits } from "viem";
import nftMarketplaceAbi from "@/constants/NftMarketplace.json";
import Image from "next/image";
import UpdateListingModal from "@/components/updateListingModal";

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;
    const separator = "...";
    const frontChars = Math.ceil((strLen - separator.length) / 2);
    const backChars = Math.floor((strLen - separator.length) / 2);
    return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars);
};

export default function NFTCard({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { address, isConnected } = useAccount();
    const [imageURI] = useState("");
    const [tokenName] = useState("");
    const [tokenDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);


    // Buy Transaction
    const { config: buyConfig } = usePrepareContractWrite({
        address: marketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "buyItem",
        args: [nftAddress, tokenId],
        value: parseUnits(price.toString(), 18),
        enabled: isConnected,
    });

    const { write: buyItem } = useWriteContract(buyConfig);

    const isOwnedByUser = seller === address || seller === undefined;
    const formattedSellerAddress = isOwnedByUser ? "You" : truncateStr(seller || "", 15);

    const handleCardClick = () => {
        isOwnedByUser ? setShowModal(true) : buyItem?.();
    };

    return (
        <div>
            {imageURI ? (
                <div>
                    <UpdateListingModal
                        isVisible={showModal}
                        tokenId={tokenId}
                        marketplaceAddress={marketplaceAddress}
                        nftAddress={nftAddress}
                        onClose={hideModal}
                    />
                    <div onClick={handleCardClick} className="cursor-pointer">
                        <div className="relative">
                            <Image loader={() => imageURI} src={imageURI} height="200" width="200" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">#{tokenId}</div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">{tokenName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{tokenDescription}</p>
                            <div className="flex items-center justify-between">
                                <div className="italic text-sm text-gray-500">Owned by {formattedSellerAddress}</div>
                                <div className="font-bold text-lg text-blue-500">{price} ETH</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
