import { useState } from "react";

const Banner3 = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="min-h-[44.7dvh] w-full">
      <div className="min-h-[44.7dvh]">
        <img
          src="/banner3Bg.png"
          alt="Banner Background"
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? "block" : "none" }}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Banner3;
