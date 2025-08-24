import MainButton from "./MainButton";
import SmallButton from "./SmallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas, faTextWidth } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const HeroFooter = () => {
  return (
    <div className="flex flex-row justify-center items-center h-[8dvh] mb-2">
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
          <span className="text-[8px] font-medium" style={{ color: "#2C2D5B" }}>
            Origin
          </span>
        </div>
        <div>
          <input
            className="text-[8px] text-center h-[15px] placeholder:text-gray-500 placeholder:text-center"
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
          <span className="text-[8px] font-medium" style={{ color: "#2C2D5B" }}>
            Destination
          </span>
        </div>
        <div>
          <input
            className="text-[8px] text-center h-[15px] placeholder:text-gray-500 placeholder:text-center"
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
            icon="fa-solid fa-weight-hanging"
          />
          <span className="text-[8px] font-medium" style={{ color: "#2C2D5B" }}>
            Weight
          </span>
        </div>
        <div>
          <input
            className="text-[8px] text-center h-[15px] placeholder:text-gray-500 placeholder:text-center"
            type="text"
            placeholder="Weight (Kg)"
            style={{ border: "1px solid #D3D3D3", borderRadius: "5px" }}
          />
        </div>
      </div>

      <div className="flex-1">
        <SmallButton
          name="Check Price"
          textColor="white"
          textSize="8px"
          bgColor="#2C2D5B"
          borderColor="#2C2D5B"
          paddingX="12px"
          paddingY="7px"
        />
      </div>
    </div>
  );
};

export default HeroFooter;
