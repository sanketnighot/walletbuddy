import React from "react"
import Image from "next/image"

const Nfts = () => {
  // Mock data for NFTs (replace with actual data later)
  const nfts = Array(9).fill(null)

  return (
    <div className="grid grid-cols-3 gap-4">
      {nfts.map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-tg-secondary-bg rounded-lg p-2"
        >
          <Image
            src="/Solana.png"
            alt={`NFT ${index + 1}`}
            width={150}
            height={150}
            className="rounded-lg"
          />
          <p className="mt-2 text-sm">NFT #{index + 1}</p>
        </div>
      ))}
    </div>
  )
}

export default Nfts
