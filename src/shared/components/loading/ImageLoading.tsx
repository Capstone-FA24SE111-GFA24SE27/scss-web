import React, { useState } from 'react'

type Props = {
     src: string, alt: string, loadingText: string
}

const ImageLoading = (props: Props) => {
    const {src, alt, loadingText = "Loading..." } = props

    const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Display loading or error state */}
      {isLoading && !hasError && <p>text</p>}
      {hasError && <p>Error loading image</p>}

      {/* Display the image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{
          display: isLoading || hasError ? "none" : "block",
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  )
}

export default ImageLoading