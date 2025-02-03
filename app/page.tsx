"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ResetPassword = dynamic(
  () => import('../components/auth/ResetPassword'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    ),
  }
)

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      }>
        <ResetPassword />
      </Suspense>
    </div>
  );
}
