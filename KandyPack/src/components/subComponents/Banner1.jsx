import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import MainButton from "./MainButton";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas, faTextWidth } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const Banner1 = () => {
  return (
    <div
      className="min-h-[35dvh] mt-4 w-full"
      style={{ backgroundColor: "#F8FAFB" }}
    >
      <div className="mx-3.5">
        <div className="flex flex-col justify-start items-center gap-1">
          <div className="flex flex-row justify-center items-center gap-48">
            <div className="flex-2">
              <span className="text-[14px] text-shadow-sm text-shadow-gray-300 font-semibold underline decoration-[#F67366] decoration-2 underline-offset-7">
                Services
              </span>
              <span className="text-[14px] font-light text-shadow-md text-shadow-gray-300 ml-1.5">
                We Offer
              </span>
            </div>
            <div className="flex-1">
              <img className="size-15" src="./banner1Logo.png" alt="logo1" />
            </div>
          </div>
          <div className="flex flex-row justify-center items-start gap-8">
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="flex-1 bg-white px-1 inline-block rounded-xl">
                <FontAwesomeIcon
                  icon="fa-solid fa-train-subway"
                  size="sm"
                  color="#2C2D5B"
                />
              </div>
              <div className="flex-2">
                <h3 className="text-[10px] leading-3 text-center mb-1 font-semibold text-shadow-md text-shadow-gray-300 text-[#2C2D5B]">
                  Rail Freight
                  <br />
                  Services
                </h3>
                <p className="text-[9px] text-justify">
                  Efficient bulk transportation of goods from Kandy to major
                  cities using Sri Lanka Railways, optimized for cargo capacity
                  and product space requirements.
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="flex-1 bg-white px-1 inline-block rounded-xl">
                <FontAwesomeIcon
                  icon="fa-solid fa-truck"
                  size="sm"
                  color="#2C2D5B"
                />
              </div>
              <div className="flex-2">
                <h3 className="text-[10px] leading-3 text-center mb-1 font-semibold text-shadow-md text-shadow-gray-300 text-[#2C2D5B]">
                  Last-Mile Delivery
                  <br />
                  Services
                </h3>
                <p className="text-[9px] text-justify">
                  Reliable truck-based delivery from stores near railway
                  stations to customer addresses, following predefined routes
                  with strict delivery time adherence.
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="flex-1 bg-white px-1 inline-block rounded-xl">
                <FontAwesomeIcon
                  icon="fa-solid fa-train-subway"
                  size="sm"
                  color="#2C2D5B"
                />
              </div>
              <div className="flex-2">
                <h3 className="text-[10px] leading-3 text-center mb-1 font-semibold text-shadow-md text-shadow-gray-300 text-[#2C2D5B]">
                  Order Scheduling &
                  <br />
                  Tracking
                </h3>
                <p className="text-[9px] text-justify">
                  Manage orders placed 7 days in advance, track multiple items
                  per order, and update delivery status for seamless supply
                  chain coordination.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-3 flex flex-row justify-center mt-6 gap-4 items-center">
            <div>
              <MainButton
                name="Request Quote"
                textColor="#2C2D5B"
                textSize="7px"
                bgColor="white"
                borderColor="#2C2D5B"
                paddingX="15px"
                paddingY="10px"
              />
            </div>
            <div>
              <MainButton
                name="Join Now"
                textColor="white"
                textSize="7px"
                bgColor="#2C2D5B"
                borderColor="#2C2D5B"
                paddingX="15px"
                paddingY="8px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner1;
