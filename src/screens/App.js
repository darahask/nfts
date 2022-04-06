import { useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { getProviderOrSigner } from "../scripts/Provider";
import CreateItem from "./create-nfts";
import CreatorDashboard from "./dashboard";
import MyAssets from "./my-nfts";
import Nfts from "./Ntfs";
import ResellNFT from "./resell-nft";

export default function App() {
    let [connected, setConnected] = useState(false);

    let connectToNetwork = async () => {
        let web3provider = await getProviderOrSigner();
        let { chainId } = await web3provider.getNetwork();
        if (chainId !== 4) {
            window.alert("Change the network to rinkeby");
            return;
        }
        setConnected(true);
    };

    return (
        <BrowserRouter>
            {!connected ? (
                <div className="flex h-screen justify-center items-center">
                    <p className="text-4xl font-bold">NFT Marketplace</p>
                    <button
                        className="p-3 ml-6 bg-red-500 text-white rounded-full"
                        onClick={connectToNetwork}
                    >
                        Connect to wallet
                    </button>
                </div>
            ) : (
                    <nav className="border-b p-6">
                        <p className="text-4xl font-bold">NFT Marketplace</p>
                        <div className="flex mt-4">
                            <Link to="/" className="mr-4 text-red-500">
                                Home
                            </Link>
                            <Link
                                to="/create-nft"
                                className="mr-6 text-red-500"
                            >
                                Sell NFT
                            </Link>
                            <Link to="/my-nfts" className="mr-6 text-red-500">
                                My NFTs
                            </Link>
                            <Link to="/dashboard" className="mr-6 text-red-500">
                                Dashboard
                            </Link>
                        </div>
                    </nav>
            )}
            <Routes>
                <Route path="/" element={<Nfts />} />
                <Route path="/create-nft" element={<CreateItem />} />
                <Route path="/my-nfts" element={<MyAssets />} />
                <Route path="/dashboard" element={<CreatorDashboard />} />
                <Route path="/resell-nft" element={<ResellNFT/>}/>
            </Routes>
        </BrowserRouter>
    );
}
