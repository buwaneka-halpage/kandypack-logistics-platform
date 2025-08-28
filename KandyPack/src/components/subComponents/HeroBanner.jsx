import MainButton from "./MainButton";

import SmallButton from "./SmallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas, faTextWidth } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const HeroBanner = () => {
  return (
    <div className="flex flex-col justify-center items-start mt-[7.5dvh] min-h-[40dvh] w-full">
      <div className="mx-3.5 flex flex-row justify-center items-start">
        <div className="flex-5 text-start">
          <div>
            <h2 className="text-[14px] font-semibold text-shadow-gray-300 text-shadow-sm">
              Streamlining Rail And Road-Based
            </h2>
            <h1
              className="text-[20px] font-semibold text-shadow-gray-300 text-shadow-sm"
              style={{ color: "#F67366", lineHeight: "25px" }}
            >
              Supply Chain Distribution
            </h1>
            <h2 className="text-[14px] font-semibold text-shadow-gray-300 text-shadow-sm">
              Across Sri Lanka
            </h2>
          </div>
          <div>
            <p
              className="text-[9px] my-2 text-shadow-gray-200 text-shadow-sm"
              style={{ color: "#333333", lineHeight: "12px" }}
            >
              KandyPack delivers unparalleled customer service through dedicated
              customer teams, engaged people working in an agile culture, and an
              island-wide footprint.
            </p>
          </div>
          <div className="flex flex-row justify-start items-center mt-4 gap-2">
            <MainButton
              name="Join Now"
              textColor="white"
              textSize="8px"
              bgColor="#2C2D5B"
              borderColor="#2C2D5B"
              paddingX="15px"
              paddingY="5px"
            />
            <MainButton
              name="Play Demo"
              textColor="#2C2D5B"
              bgColor="white"
              paddingX="5px"
              paddingY="8px"
              textSize="8px"
            />
          </div>
        </div>
        <div className="flex-10">
          <img className="w-100 h-55" src="./heroBg.png" alt="heroBg" />
        </div>
      </div>

      <div className="flex-1 flex flex-row justify-center items-center min-h-[8dvh] my-3 mx-3.5">
        <div
          className="flex-1 flex flex-col justify-center items-center"
          style={{ lineHeight: "15px" }}
        >
          <div>
            <FontAwesomeIcon
              size="xs"
              color="#2C2D5B"
              icon="fa-solid fa-location-dot"
            />
            <span
              className="text-[8px] font-medium"
              style={{ color: "#2C2D5B" }}
            >
              Origin
            </span>
          </div>
          <div>
            <input
              className="text-[8px] text-center min-h-[15px] placeholder:text-gray-500 placeholder:text-center"
              type="text"
              placeholder="Enter Location"
              style={{ border: "1px solid #D3D3D3", borderRadius: "5px" }}
            />
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center items-center"
          style={{ lineHeight: "15px" }}
        >
          <div>
            <FontAwesomeIcon
              size="xs"
              color="#2C2D5B"
              icon="fa-solid fa-location-dot"
            />
            <span
              className="text-[8px] font-medium"
              style={{ color: "#2C2D5B" }}
            >
              Destination
            </span>
          </div>
          <div>
            <input
              className="text-[8px] text-center min-h-[15px] placeholder:text-gray-500 placeholder:text-center"
              type="text"
              placeholder="Enter Location"
              style={{ border: "1px solid #D3D3D3", borderRadius: "5px" }}
            />
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center items-center mr-2"
          style={{ lineHeight: "15px" }}
        >
          <div>
            <FontAwesomeIcon
              size="xs"
              color="#2C2D5B"
              icon="fa-solid fa-weight-hanging"
            />
            <span
              className="text-[8px] font-medium"
              style={{ color: "#2C2D5B" }}
            >
              Weight
            </span>
          </div>
          <div>
            <input
              className="text-[8px] text-center min-h-[15px] placeholder:text-gray-500 placeholder:text-center"
              type="text"
              placeholder="Weight (Kg)"
              style={{ border: "1px solid #D3D3D3", borderRadius: "5px" }}
            />
          </div>
        </div>

        <div className="flex-1">
          <SmallButton
            name="Check"
            textColor="white"
            textSize="8px"
            bgColor="#2C2D5B"
            borderColor="#2C2D5B"
            paddingX="8px"
            paddingY="8px"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
