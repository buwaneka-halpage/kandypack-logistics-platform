import { Train, Truck, CalendarCheck } from "lucide-react";
import MainButton from "./MainButton";
import { Link } from "react-router";
import "app/app.css";

const Banner1 = () => {
  const handleRequestQuote = () => {
    console.log("Quote requested!");
  };

  return (
    <div
      className="min-h-[35dvh] mt-4 w-full sm:pb-4"
      style={{ backgroundColor: "white" }}
    >
      <div className="mx-3.5 sm:mx-8 md:mx-6">
        <div className="flex flex-col justify-start items-center gap-1">
          <div className="lg:mb-3 flex flex-row justify-center items-center gap-48 sm:gap-100 md:gap-100 lg:gap-220 md:mt-5">
            <div className="flex-2 md:flex-3">
              <span className="text-[14px] sm:text-[14.5px] md:text-[22px] lg:text-[32px] font-semibold underline decoration-[#F67366] decoration-2 underline-offset-7">
                Services
              </span>
              <span className="text-[14px] sm:text-[14.5px] md:text-[22px] lg:text-[32px] font-light ml-1.5">
                We Offer
              </span>
            </div>
            <div className="flex-1">
              <img
                className="size-15 md:w-40 md:h-20"
                src="/banner1Logo.png"
                alt="logo"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center items-start gap-8 lg:gap-30">
            {/* Rail Freight Card */}
            <div className="p-5 animated-box flex-1 flex flex-col justify-center items-center">
              <div className="flex-1 bg-white px-1 inline-block rounded-xl">
                <Train
                  className="text-[15px] sm:text-[16px] md:text-[25px] lg:text-[40px] w-8 h-8 lg:w-12 lg:h-12"
                  color="#2C2D5B"
                />
              </div>
              <div className="flex-2">
                <h3 className="lg:my-3 text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-3 md:leading-4.5 lg:leading-7 text-center mb-1 sm:mb-2 font-semibold text-[#2C2D5B]">
                  Rail Freight
                  <br />
                  Services
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-[12px] lg:text-[18px] sm:leading-3 md:leading-3.5 lg:leading-6 text-justify">
                  Efficient bulk transportation of goods from Kandy to major
                  cities using Sri Lanka Railways, optimized for cargo capacity
                  and product space requirements.
                </p>
              </div>
            </div>

            {/* Last-Mile Delivery Card */}
            <div className="p-5 animated-box flex-1 flex flex-col justify-center items-center">
              <div className="flex-1 bg-white px-1 inline-block rounded-xl">
                <Truck
                  className="text-[15px] sm:text-[16px] md:text-[25px] lg:text-[40px] w-8 h-8 lg:w-12 lg:h-12"
                  color="#2C2D5B"
                />
              </div>
              <div className="flex-2">
                <h3 className="lg:my-3 text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-3 md:leading-4.5 lg:leading-7 text-center mb-1 sm:mb-2 font-semibold text-[#2C2D5B]">
                  Last-Mile Delivery
                  <br />
                  Services
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-[12px] lg:text-[18px] sm:leading-3 md:leading-3.5 lg:leading-6 text-justify">
                  Reliable truck-based delivery from stores near railway
                  stations to customer addresses, following predefined routes
                  with strict delivery time adherence.
                </p>
              </div>
            </div>

            {/* Order Scheduling & Tracking Card */}
            <div className="p-5 animated-box flex-1 flex flex-col justify-center items-center">
              <div className="flex-1 bg-white px-1 inline-block rounded-xl">
                <CalendarCheck
                  className="text-[15px] sm:text-[16px] md:text-[25px] lg:text-[40px] w-8 h-8 lg:w-12 lg:h-12"
                  color="#2C2D5B"
                />
              </div>
              <div className="flex-2">
                <h3 className="lg:my-3 text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-3 md:leading-4.5 lg:leading-7 text-center mb-1 sm:mb-2 font-semibold text-[#2C2D5B]">
                  Order Scheduling &
                  <br />
                  Tracking
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-[12px] lg:text-[18px] sm:leading-3 md:leading-3.5 lg:leading-6 text-justify">
                  Manage orders placed 7 days in advance, track multiple items
                  per order, and update delivery status for seamless supply
                  chain coordination.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:my-10 flex-3 flex flex-row justify-center mt-6 gap-4 items-center">
            <div>
              <MainButton
                name="Request Quote"
                textColor="#2C2D5B"
                textSize="7px"
                bgColor="white"
                borderColor="#2C2D5B"
                paddingX="15px"
                paddingY="10px"
                onClick={handleRequestQuote}
              />
            </div>
            <div>
              <Link to="/login">
                <MainButton
                  name="Join Now"
                  textColor="white"
                  textSize="7px"
                  bgColor="#2C2D5B"
                  borderColor="#2C2D5B"
                  paddingX="15px"
                  paddingY="8px"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner1;
