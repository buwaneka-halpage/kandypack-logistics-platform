import MainButton from "./MainButton";

const HeroBanner = () => {
  return (
    <div className="flex flex-row justify-center items-start w-full mt-[7.5dvh] mx-3.5 h-[27dvh]">
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
            border="none"
          />
        </div>
      </div>
      <div className="flex-10">
        <img src="./src/assets/heroBg.png" alt="heroBg" />
      </div>
    </div>
  );
};

export default HeroBanner;
