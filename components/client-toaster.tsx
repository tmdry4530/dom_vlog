"use client";

import dynamic from 'next/dynamic'

// Toaster를 클라이언트에서만 렌더링하도록 동적 import
const DynamicToaster = dynamic(
  () => import('@/components/ui/sonner').then((mod) => ({ default: mod.Toaster })),
  { 
    ssr: false,
    loading: () => null 
  }
)

export function ClientToaster() {
  return <DynamicToaster />;
} 