"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"

import SignContent from "./SignContent"

export default function SignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignContent />
    </Suspense>
  )
}
