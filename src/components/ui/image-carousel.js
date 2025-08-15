"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Go to next image
  const nextImage = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Go to previous image
  const prevImage = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return
    
    const timer = setInterval(() => {
      nextImage()
    }, 5000)
    
    return () => clearInterval(timer)
  }, [nextImage, images.length])

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      )}
      
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={images[currentIndex]?.fileUrl || "/placeholder.svg"}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: isLoaded ? 1 : 0 }}
		  width={100}
		  height={100}
          onLoad={handleImageLoad}
        />
      </div>
      
      {/* Navigation arrows - only show if more than one image */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
      
      {/* Image counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}