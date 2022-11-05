import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { NFTCard } from "../components/nftCard";

const Home: NextPage = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [pageKeys, setPageKeys] = useState([] as string[]);
  const [currentPage, setCurrentPage] = useState(0);

  const api_key = "[INSERT Alchemy Eth Mainnet API Key]";

  const [NFTs, setNFTs] = useState([]);
  const fetchNFTs = async (page: number) => {
    let nfts;
    console.log("fetching nfts");
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}${
        page && pageKeys[page] ? `&pageKey=${pageKeys[page]}` : ""
      }`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}${
        page && pageKeys[page] ? `&pageKey=${pageKeys[page]}` : ""
      }`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
      if (nfts["pageKey"]) {
        const newPageKeys = pageKeys.slice();
        newPageKeys[page + 1] = nfts["pageKey"];
        setPageKeys(newPageKeys);
      }
    }
  };

  const fetchNFTsForCollection = async (page: number) => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}${
        page && pageKeys[page] ? `&startToken=${pageKeys[page]}` : ""
      }&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
        if (nfts["nextToken"]) {
          const newPageKeys = pageKeys.slice();
          newPageKeys[page + 1] = nfts["nextToken"];
          setPageKeys(newPageKeys);
        }
      }
    }
  };

  const getNFTs = (page?: number) => {
    if (fetchForCollection) {
      fetchNFTsForCollection(page ?? 0);
    } else fetchNFTs(page ?? 0);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <Head>
        <script
          src="https://kit.fontawesome.com/30d939d316.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          className="input-fit indent-2"
          disabled={fetchForCollection}
          onChange={(e) => {
            setPageKeys([]);
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="input-fit indent-2"
          onChange={(e) => {
            setPageKeys([]);
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setPageKeys([]);
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-pink-500 px-4 py-2 mt-3 rounded-sm w-1/5 hover:bg-green-400"
          }
          onClick={() => getNFTs()}
        >
          Let's go!{" "}
        </button>
        <div className="flex flex-row gap-x-3">
          <button
            disabled={currentPage < 1}
            className="text-pink-500 disabled:text-slate-800"
            onClick={() => {
              if (currentPage > 0) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                getNFTs(newPage);
              }
            }}
          >
            <i className="fas fa-backward"></i>
          </button>
          <button
            disabled={pageKeys.length === 0}
            className="text-pink-500 disabled:text-slate-800"
            onClick={() => {
              if (pageKeys.length) {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                getNFTs(newPage);
              }
            }}
          >
            <i className="fas fa-forward"></i>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-y-2 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length
          ? NFTs.map((nft) => {
              return <NFTCard nft={nft}></NFTCard>;
            })
          : null}
      </div>
    </div>
  );
};

export default Home;
