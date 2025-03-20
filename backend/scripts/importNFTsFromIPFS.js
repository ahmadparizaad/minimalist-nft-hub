require("dotenv").config();
const axios = require("axios");

async function fetchMetadataFromIPFS(ipfsHash) {
  try {
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.VITE_PINATA_JWT}` },
    };

    const response = await axios.get(`https://api.pinata.cloud/v3/files/public/${ipfsHash}`, options);

    console.log("Fetched NFT Metadata:", response.data);
  } catch (error) {
    console.error(`Error fetching metadata for hash ${ipfsHash}:`, error.response ? error.response.data : error.message);
  }
}

// Example: Fetch metadata for a specific IPFS hash
const ipfsHash = "QmSJAWCLG7dxLGQQKEVge7jv6q5dR4LLC88aaDfJKhePXE"; // Replace with your NFT's IPFS hash

fetchMetadataFromIPFS(ipfsHash);
