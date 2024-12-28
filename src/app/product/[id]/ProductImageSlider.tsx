"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageSliderProps {
  images: string[];
}

export function ProductImageSlider({ images }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full md:w-1/2 h-64 md:h-[450px]">
      <div className="absolute top-1/2 left-4 z-10">
        <button
          onClick={goToPrevious}
          className="bg-white rounded-full p-2 shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 z-10">
        <button
          onClick={goToNext}
          className="bg-white rounded-full p-2 shadow-md"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <img
        src={images[currentIndex]}
        // src="dfgdgf"
        alt={`Product image ${currentIndex + 1}`}
        className="w-full h-full object-contain "
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === slideIndex ? "bg-gray-800" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
