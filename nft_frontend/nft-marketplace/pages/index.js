import { useAccount } from "wagmi";
import NFTCard from "@/components/NFTCard";
import { useEffect, useState } from "react";
import { fetchListedNFTs } from "@/utils/fetchNFT";


export default function Home() {
  const { isConnected } = useAccount();
const [listedNfts, setListedNfts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (isConnected) {
    fetchListedNFTs()
      .then((nfts) => {
        setListedNfts(nfts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
        setLoading(false);
      });
  }
}, [isConnected]);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Listed Items</h1>
      <div className="flex flex-wrap">
        {isConnected ? (
          loading ? (
            <div>Loading...</div>
          ) : listedNfts.length > 0 ? (
            listedNfts.map((nft) => (
              <NFTCard
                key={`${nft.nftAddress}-${nft.tokenId}`}
                price={nft.price}
                nftAddress={nft.nftAddress}
                tokenId={nft.tokenId}
                marketplaceAddress={nft.marketplaceAddress}
                seller={nft.seller}
              />
            ))
          ) : (
            <div>No NFTs listed yet.</div>
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
}
