'use client'
import useBackButton from '@/hooks/useBackButton'
import React, { useEffect, useRef } from 'react'

const ImportWallet = () => {
  useBackButton()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-dvh text-center bg-tg-bg'>
      <h1 className='text-tg-text text-3xl font-bold mb-4'>Import your Wallet</h1>
      <div className='text-tg-text w-full'>
        <textarea 
          ref={textareaRef}
          id="message" 
          rows={3} 
          className="block p-2.5 w-5/6 mx-auto text-lg text-tg-button-text bg-tg-hint rounded-lg border border-gray-300 placeholder:text-tg-button-text" 
          placeholder="Enter your seed phrxase here ..."/>
      </div>
      <button className='w-4/6 bg-tg-button text-tg-button-text px-4 py-2 mt-4 rounded-md'>
        Import Wallet
      </button>
    </div>
  )
}

export default ImportWallet