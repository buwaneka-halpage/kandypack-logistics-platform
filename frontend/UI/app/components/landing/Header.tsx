import { Link } from "react-router";
import DropDown from "./DropDown";
import SmallButton from "./SmallButton";

const Header = () => {
  return (
    <header
      className="flex flex-wrap flex-col justify-center max-h-[8dvh] sm:max-h-[18dvh] md:max-h-[8dvh] lg:max-h-[12dvh] bg-white w-full fixed top-0 shadow-sm shadow-gray-200 lg:shadow-sm"
      style={{ zIndex: 100 }}
    >
      <div className="flex flex-wrap flex-row justify-around items-center">
        <div className="flex-2 lg:flex-1 text-start ml-3.5 md:ml-4.5 lg:ml-5">
          <Link to="/">
            <h1 className="text-[16px] sm:text-[18.5px] md:text-[25px] lg:text-[24px] cursor-pointer">
              <span style={{ color: "#2C2D5B" }}>Kandy</span>
              <span style={{ color: "#F67366" }}>Pack</span>
            </h1>
          </Link>
        </div>
        <div className="flex-4 lg:flex-6 text-center flex flex-wrap flex-row justify-start lg:justify-center gap-1 sm:gap-10 lg:gap-25 items-center">
          <div>
            <DropDown
              name="Company"
              textColor="black"
              textSize="text-[9.5px] sm:text-[11px] md:text-[15px]"
            />
          </div>
          <div>
            <DropDown
              name="Services"
              textColor="black"
              textSize="text-[9.5px] sm:text-[11px] md:text-[15px]"
            />
          </div>
          <div className="cursor-default text-[8px] sm:text-[11px] md:text-[15px] block lg:hidden">
            News
            <br />&<br />
            Media
          </div>
          <div className="cursor-default text-[8px] sm:text-[11px] md:text-[15px] hidden lg:block">
            News & Media
          </div>
        </div>
        <div className="flex-2 sm:flex-3 lg:flex-2 flex flex-wrap flex-row justify-center lg:justify-end items-center sm:justify-center sm:gap-4 lg:gap-2 sm:ml-8 lg:mr-6">
          <div>
            <SmallButton
              name="Request Quote"
              textColor="#2C2D5B"
              bgColor="white"
              borderColor="#2C2D5B"
              paddingX="5px"
              paddingY="8px"
            />
          </div>
          <div className="hidden sm:inline-block">
            <Link to="/login">
              <SmallButton
                name="Join Now"
                textColor="white"
                bgColor="#2C2D5B"
                borderColor="#2C2D5B"
                paddingX="6px"
                paddingY="8px"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
