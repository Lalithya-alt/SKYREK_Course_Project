import React, { useState } from 'react'

export default function ProductImageSlideshow(props) {
  const images = props.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full max-w-[600px] h-[600px] flex items-center justify-center group">

      {/* Image */}
      {images.length > 0 && (
        <img
          src={images[currentIndex]}
          alt="Product image"
          className="w-full h-full object-contain transition-all duration-500 ease-in-out group-hover:scale-105"
        />
      )}

      {/* Navigation dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-3 h-3 bg-white shadow-md"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

    </div>
  )
}