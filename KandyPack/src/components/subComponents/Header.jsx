import DropDown from "./DropDown";
import SmallButton from "./SmallButton";

const Header = () => {
  return (
    <header
      className="flex flex-col justify-center min-h-[6dvh] bg-white w-full fixed top-0 shadow-sm shadow-gray-100"
      style={{ zIndex: "100" }}
    >
      <div className="flex flex-row justify-around items-center">
        <div className="flex-2 text-center">
          <h1 className="text-[16px] cursor-default">
            <span style={{ color: "#2C2D5B" }}>Kandy</span>
            <span style={{ color: "#F67366" }}>Pack</span>
          </h1>
        </div>
        <div className="flex-4 text-center flex flex-row justify-start gap-2 mr-1 items-center">
          <div>
            <DropDown name="Company" textColor="black" textSize="8px" />
          </div>
          <div>
            <DropDown name="Services" textColor="black" textSize="8px" />
          </div>
          <div className="cursor-default text-[8px]">
            News
            <br />&<br />
            Media
          </div>
        </div>
        <div className="flex-3 flex flex-row justify-around items-center">
          <div>
            <SmallButton
              name="Request Quote"
              textColor="#2C2D5B"
              textSize="7px"
              bgColor="white"
              borderColor="#2C2D5B"
              paddingX="10px"
              paddingY="4px"
            />
          </div>
          <div>
            <SmallButton
              name="Join Now"
              textColor="white"
              textSize="7px"
              bgColor="#2C2D5B"
              borderColor="#2C2D5B"
              paddingX="10px"
              paddingY="4px"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
