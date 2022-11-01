export const NFTCard = ({ nft, indexKey }) => {
  const copy = () => {
    navigator.clipboard.writeText(nft.contract.address);
  };
  return (
    <div className="w-1/4 flex flex-col " key={indexKey}>
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        ></img>
      </div>
      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div className="">
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600 break-all">Id: {nft.id.tokenId}</p>
          <div className="flex flex-row items-center">
            <i className="fas fa-regular fa-copy" onClick={copy}></i>
            <p className="text-gray-600 break-all pl-2">
              {nft.contract.address}
            </p>
          </div>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600">{nft.description}</p>
        </div>
      </div>
    </div>
  );
};
