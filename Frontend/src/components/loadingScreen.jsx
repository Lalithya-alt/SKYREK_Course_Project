import React from 'react'

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
    </div>
  )
}
