'use client'

import React, { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import useBackButton from '@/hooks/useBackButton'

const words = [
	'apple', 'banana', 'orange', 'pear', 'plum', 'grape', 'kiwi', 'mango', 'pineapple', 'strawberry', 'apple', 'banana'
]

const CreateWallet = () => {
  const [copied, setCopied] = useState(false)
  useBackButton()

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied])
  return (
    <div className='flex flex-col items-center min-h-dvh text-center gap-2 bg-tg-bg p-2'>
      <h1 className='text-tg-text text-3xl font-bold m-4'>Create Wallet</h1>
      <h2 className='text-tg-section-header-text text-xl font-bold mb-4'>Store the following 12-word seed phrase securly</h2>
      <div className='text-tg-text'>
        <div className='grid grid-cols-3 gap-2 mt-4 mx-2'>
          {words.map((word, index) => (
            <div key={index} className='text-tg-text border border-tg-border rounded-md p-2 text-center bg-tg-header-bg'>{word}</div>
          ))}
        </div>
        <div className='text-tg-hint mt-4 mx-2'>
          <p>
            <span className='font-bold underline'>Note:</span>
            {' '}
            <span>
              This seed phrase is the only way to recover your wallet. If you lose it, you will lose access to your wallet.
            </span>
          </p>
        </div>
        <div className='text-tg-text mt-4'>
          <button 
          className='w-4/6 text-tg-text rounded-md px-4 py-2 border border-tg-border flex items-center justify-center gap-2 mx-auto'
          onClick={() => {
            navigator.clipboard.writeText(words.join(' '))
            setCopied(true)
          }}
          disabled= {copied}
          > {copied? 'Copied' : (<><Copy/> Copy to clipboard</>)}</button>
        </div>
        <div className='text-tg-text mt-2'>
          <button className='text-tg-button-text rounded-md p-2 w-4/6 mx-auto border bg-tg-button'> Next</button>
        </div>
      </div>
    </div>
  )
}

export default CreateWallet