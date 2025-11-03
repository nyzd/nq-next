"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function StickyJumpBar() {
  const [isOpen, setIsOpen] = useState(false)

  const jumpPoints = [
    { number: 1, label: "Introduction" },
    { number: 2, label: "Features" },
    { number: 3, label: "Conclusion" },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg border border-blue-500/30 shadow-xl hover:shadow-2xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 cursor-pointer flex items-center justify-between px-6"
      >
        <div className="flex items-center justify-around w-full gap-4">
          {jumpPoints.map((point) => (
            <div key={point.number} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <span className="text-white font-bold text-lg">{point.number}</span>
              </div>
              <span className="text-white text-xs mt-1 font-medium">{point.label}</span>
            </div>
          ))}
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Jump Bar Navigation</DialogTitle>
            <DialogDescription>
              Click anywhere on the sticky bar to open this popup. The bar shows 3 sections to help you navigate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {jumpPoints.map((point) => (
              <div key={point.number} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{point.number}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{point.label}</h3>
                  <p className="text-sm text-muted-foreground">Navigate to section {point.number} of the page</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
