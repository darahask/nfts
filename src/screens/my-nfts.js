import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { marketplaceAddress, NFTMarketplace } from "../config";
import { getProviderOrSigner } from "../scripts/Provider";

export default function MyAssets() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");
    const router = useNavigate();
    useEffect(() => {
        loadNFTs();
    }, []);
    async function loadNFTs() {
        let signer = await getProviderOrSigner(true);

        const marketplaceContract = new ethers.Contract(
            marketplaceAddress,
            NFTMarketplace.abi,
            signer
        );
        const data = await marketplaceContract.fetchMyNFTs();

        const items = await Promise.all(
            data.map(async (i) => {
                const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenURI);
                let price = ethers.utils.formatUnits(
                    i.price.toString(),
                    "ether"
                );
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    tokenURI,
                };
                return item;
            })
        );
        setNfts(items);
        setLoadingState("loaded");
    }
    function listNFT(nft) {
        console.log("nft:", nft);
        router(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
    }
    if (loadingState === "loaded" && !nfts.length)
        return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
    return (
        <div>
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {nfts.map((nft, i) => (
                        <div
                            key={i}
                            className="border shadow rounded-xl overflow-hidden"
                        >
                            <div
                                className="image-fill"
                                style={{
                                    backgroundImage: `url(${nft.image})`,
                                }}
                            />
                            <div className="p-4 bg-black">
                                <p className="text-2xl font-bold text-white">
                                    Price - {nft.price} Eth
                                </p>
                                <button
                                    className="mt-4 w-full bg-red-500 text-white font-bold py-2 px-12 rounded"
                                    onClick={() => listNFT(nft)}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
