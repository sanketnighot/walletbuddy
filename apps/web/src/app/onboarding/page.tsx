'use client'

import useBackButton from '@/hooks/useBackButton'
import Link from 'next/link'
import React from 'react'

const Onboarding = () => {

  useBackButton()
  return (
    <main className="flex flex-col items-center justify-center h-dvh text-center gap-2 bg-tg-bg">
      <Link href="/onboarding/createWallet">
        <button className=" w-72 bg-tg-button text-tg-button-text px-4 py-2 rounded-md">
          Create New Wallet
        </button>
      </Link>
      <Link href="/onboarding/importWallet">
        <button className="w-72 bg-tg-button text-tg-button-text px-4 py-2 rounded-md">
					Import Existing Wallet
				</button>
      </Link>
    </main>
  )
}

export default Onboarding