
// pragma solidity ^0.8.18;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
// error ItemNotForSale(address nftAddress, uint256 tokenId);
// error NotListed(address nftAddress, uint256 tokenId);
// error AlreadyListed(address nftAddress, uint256 tokenId);
// error NoProceeds();
// error NotOwner();
// error NotApprovedForMarketplace();
// error PriceMustBeAboveZero();

// contract NFTMarketplace is ERC721, Ownable, ReentrancyGuard {
//     // struct Listing {
//     //     uint256 price;
//     //     address seller;
//     // }
//     uint256 public tokenCount;
//     uint256 public constant MAX_SUPPLY = 10000;
//     mapping(uint256 => uint256) public tokenPrices;

//     event NFTItemMinted(
//         address indexed owner, 
//         uint256 tokenId
//     );
//     event NFTItemListed(
//         address indexed owner, 
//         uint256 tokenId, 
//         uint256 price
//     );
//     event NFTItemSold(
//         address indexed buyer, 
//         address indexed seller, 
//         uint256 tokenId, 
//         uint256 price
//     );

//     constructor() ERC721("NFT Marketplace", "NFTM") {}

//     function mintNFT() external {
//         require(tokenCount < MAX_SUPPLY, "Max supply reached");
//         tokenCount++;
//         _safeMint(msg.sender, tokenCount);
//         emit NFTItemMinted(msg.sender, tokenCount);
//     }

//     function listNFT(
//         uint256 tokenId, 
//         uint256 price
//         ) external {
//         require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
//         require(price > 0, "Price must be greater than zero");
//         tokenPrices[tokenId] = price;
//         emit NFTItemListed(msg.sender, tokenId, price);
//     }

//     function buyNFT(uint256 tokenId) external payable nonReentrant {
//         uint256 price = tokenPrices[tokenId];
//         require(price > 0, "NFT not for sale");
//         require(msg.value >= price, "Insufficient funds");

//         address seller = ownerOf(tokenId);
//         _transfer(seller, msg.sender, tokenId);

//         (bool success, ) = payable(seller).call{value: msg.value}("");
//         require(success, "Transfer failed");

//         tokenPrices[tokenId] = 0;
//         emit NFTItemSold(msg.sender, seller, tokenId, price);
//     }
// }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract NFTMarketplace is ERC721, Ownable, ReentrancyGuard {
    struct Listing {
    uint256 price;
    address seller;
    
}
    uint256 public tokenCount;
    uint256 public constant MAX_SUPPLY = 10000;

    mapping(uint256 => uint256) public tokenPrices;
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;



    event NFTItemMinted(
        address indexed owner, 
        uint256 tokenId
    );
    event NFTItemListed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );
    event NFTItemSold(
        address indexed buyer, 
        address indexed seller, 
        uint256 tokenId, 
        uint256 price
    );
     event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

     modifier isOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) {
        revert NotOwner();
    }
    _;
        
    }

     modifier isListed(uint256 tokenId) {
    Listing memory listing = s_listings[address(this)][tokenId]; 
    if (listing.price <= 0) {
        revert NotListed(address(this), tokenId);
    }
    _;
}



    constructor() ERC721("NFT Marketplace", "NFTM") {}

    function mintNFT() external {
        if (tokenCount >= MAX_SUPPLY) {
            revert AlreadyListed(address(this), tokenCount); // Using AlreadyListed as an example
        }
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        emit NFTItemMinted(msg.sender, tokenCount);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotOwner();
        }
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        if (tokenPrices[tokenId] > 0) {
            revert AlreadyListed(address(this), tokenId);
        }

        tokenPrices[tokenId] = price;
        emit NFTItemListed(msg.sender, tokenId, price);
    }

    function cancelListing( uint256 tokenId)
        external
       isOwner(tokenId) 
    isListed(tokenId) 
{
    delete s_listings[address(this)][tokenId];
    emit ItemCanceled(msg.sender, address(this), tokenId);
}

function buyNFT(uint256 tokenId) external payable nonReentrant {
        uint256 price = tokenPrices[tokenId];
        if (price == 0) {
            revert ItemNotForSale(address(this), tokenId);
        }
        if (msg.value < price) {
            revert PriceNotMet(address(this), tokenId, price);
        }

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);

        (bool success, ) = payable(seller).call{value: msg.value}("");
        if (!success) {
            revert NoProceeds();
        }

        tokenPrices[tokenId] = 0;
        emit NFTItemSold(msg.sender, seller, tokenId, price);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(tokenId)
        nonReentrant
        isOwner(tokenId)
    {
        if (newPrice <= 0) {
            revert PriceMustBeAboveZero();
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit NFTItemListed(msg.sender, tokenId, newPrice);
    }


    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }

}
