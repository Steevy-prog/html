import React, { useEffect, useState } from "react";
import getImage from "./imageapi.ts";

const ImageComponent = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const blob = await getImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    };

    fetchImage();

    // Optional: clean up URL to avoid memory leaks
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);

  return (
    <div className="w-full h-48">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="CER Example"
          className="w-full h-full object-cover"
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ImageComponent;