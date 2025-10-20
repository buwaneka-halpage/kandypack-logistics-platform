import MainButton from "./MainButton";
import SmallButton from "./SmallButton";
import { MapPin, Weight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import "app/app.css";

const HeroBanner = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");

  const handleCheckPrice = () => {
    console.log({ origin, destination, weight });
  };

  return (
    <div className="hero-rainbow-overlay flex flex-wrap flex-col justify-center items-start mt-[10.5dvh] sm:mt-[22.5dvh] md:mt-[10dvh] lg:mt-[14dvh] min-h-[35dvh] w-full">
      <div className="mx-3.5 sm:mx-8 md:mx-6 flex flex-wrap flex-row justify-center items-start">
        <div className="flex-5 md:flex-6 lg:flex-1 text-start md:mt-6">
          <div>
            <h2 className="text-[14px] sm:text-[18px] md:text-[25px] lg:text-[32px] leading-5 sm:leading-6 md:leading-7.5 lg:leading-10 font-semibold">
              Streamlining Rail And Road-Based
            </h2>
            <h1
              className="text-[20px] sm:text-[25px] md:text-[32px] lg:text-[40px] leading-6 sm:leading-8 md:leading-10 lg:leading-15 font-semibold"
              style={{ color: "#F67366" }}
            >
              Supply Chain Distribution
            </h1>
            <h2 className="text-[14px] sm:text-[18px] md:text-[25px] lg:text-[32px] leading-5 md:leading-7.5 lg:leading-10 font-semibold">
              Across Sri Lanka
            </h2>
          </div>
          <div>
            <p
              className="lg:my-6 text-[9px] sm:text-[10px] md:text-[15px] lg:text-[20px] my-2 leading-3 sm:leading-3 md:leading-4.5 lg:leading-7"
              style={{ color: "#333333" }}
            >
              KandyPack delivers unparalleled customer service through dedicated
              customer teams, engaged people working in an agile culture, and an
              island-wide footprint.
            </p>
          </div>
          <div className="flex flex-wrap flex-row justify-start items-center mt-4 gap-2 lg:gap-5 lg:mt-13.5">
            <Link to="/login">
              <MainButton
                name="Join Now"
                textColor="white"
                textSize="50%"
                bgColor="#2C2D5B"
                borderColor="#2C2D5B"
                paddingX="10px"
                paddingY="5px"
              />
            </Link>
            <MainButton
              name="Play Demo"
              textColor="#2C2D5B"
              bgColor="#f0f0f0"
              paddingX="5px"
              paddingY="8px"
              textSize="50%"
            />
          </div>
        </div>

        <div className="hero-bg rounded-2xl flex-10 sm:flex-10 md:flex-8 lg:flex-1 w-100 h-55 sm:w-100 sm:h-70 md:w-150 md:h-90 lg:w-150 lg:h-105 lg:ml-5"></div>
      </div>

      <div className="flex-1 flex flex-wrap flex-row justify-center items-center min-h-[8dvh] mt-1 sm:mt-0 sm:mb-3 mx-3.5 sm:gap-2 sm:mx-8 md:mx-6 md:gap-10 lg:gap-20">
        <div
          className="flex-1 flex flex-wrap flex-col justify-center items-center"
          style={{ lineHeight: "15px" }}
        >
          <div>
            <MapPin className="inline-block w-4 h-4 mr-1" color="#2C2D5B" />
            <span
              className="text-[8px] sm:text-[10px] md:text-[14px] lg:text-[16px] font-medium"
              style={{ color: "#2C2D5B" }}
            >
              Origin
            </span>
          </div>
          <div className="md:mt-2">
            <input
              className="border-none outline-none animated-input text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] w-22 sm:w-40 text-center min-h-[20px] md:min-h-[30px] placeholder:text-gray-500 placeholder:text-center"
              type="text"
              placeholder="Enter Location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{ border: "1px solid #D3D3D3", borderRadius: "5px" }}
            />
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center items-center"
          style={{ lineHeight: "15px" }}
        >
          <div>
            <MapPin className="inline-block w-4 h-4 mr-1" color="#2C2D5B" />
            <span
              className="text-[8px] sm:text-[10px] md:text-[14px] lg:text-[16px] font-medium"
              style={{ color: "#2C2D5B" }}
            >
              Destination
            </span>
          </div>
          <div className="md:mt-2">
            <input
              className="border-none outline-none animated-input text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] w-22 sm:w-40 text-center min-h-[20px] md:min-h-[30px] placeholder:text-gray-500 placeholder:text-center"
              type="text"
              placeholder="Enter Location"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center items-center mr-2"
          style={{ lineHeight: "15px" }}
        >
          <div>
            <Weight className="inline-block w-4 h-4 mr-1" color="#2C2D5B" />
            <span
              className="text-[8px] sm:text-[10px] md:text-[14px] lg:text-[16px] font-medium"
              style={{ color: "#2C2D5B" }}
            >
              Weight
            </span>
          </div>
          <div className="md:mt-2">
            <input
              className="border-none outline-none animated-input text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] w-22 sm:w-40 text-center min-h-[20px] md:min-h-[30px] placeholder:text-gray-500 placeholder:text-center input-field"
              type="text"
              placeholder="Weight (Kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ border: "1px solid #D3D3D3", borderRadius: "5px" }}
            />
          </div>
        </div>

        <div className="flex-2 lg:ml-[-25px]">
          <SmallButton
            name="Check"
            textColor="white"
            bgColor="#2C2D5B"
            borderColor="#2C2D5B"
            paddingX="10px"
            paddingY="8px"
            onClick={handleCheckPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
