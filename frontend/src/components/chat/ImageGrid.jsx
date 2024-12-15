import React from 'react';

const ImageGrid = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={image.url}
            alt={image.alt || 'Generated image'}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;