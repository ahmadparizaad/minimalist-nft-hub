
// Contract address and ABI
export const contractAddress = "0xYourContractAddressHere"; // Replace with your actual contract address

export const abi = [
  // Basic ERC721 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function GetCurrentToken() view returns (uint256)",
  
  // Custom marketplace functions
  "function getNFTDetails(uint256 tokenId) view returns (address creator, address owner, uint256 price, address paymentToken, string ipfsHash, uint256 royaltyFee, string[] transactionHistory)",
  "function GetNftPrice(uint256 tokenId) view returns (uint256)",
  "function GetNFTDetails(uint256 tokenId) view returns (address creator, address owner, uint256 price, string IpfsHash)",
  "function GetTransactionHistory(uint256 tokenId) view returns (string[] memory)",
  "function buy(uint256 tokenId) payable returns (bool)",
  "function createToken(string memory ipfsHash, uint256 price, uint256 royaltyFee, address paymentToken) returns (uint256)",
  
  // Standard ERC721 events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)"
];
