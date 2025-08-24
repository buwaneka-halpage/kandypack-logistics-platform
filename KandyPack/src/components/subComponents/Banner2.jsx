const Banner2 = () => {
  return (
    <div className="h-[59dvh] mt-0">
      <div className="h-[59dvh] mx-3.5">
        <div className="flex flex-row justify-center items-center gap-4 mb-0">
          <div className="flex-1">
            <img
              className="size-15"
              src="./src/assets/banner1Logo.png"
              alt="logo1"
            />
          </div>
          <div className="flex-2">
            <span className="text-[14px] text-shadow-sm text-shadow-gray-300 font-semibold underline decoration-[#F67366] decoration-2 underline-offset-7">
              Operation
            </span>
            <span className="text-[14px] font-light text-shadow-md text-shadow-gray-300 ml-1.5">
              Mode
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 items-center">
          <div className="relative">
            <h3 className="text-[14px] leading-8 font-bold">
              <span className="px-2 py-1 text-[10px] text-white rounded-[20px] bg-[#2C2D5B]">
                1
              </span>
              <span className="mx-2 text-[#F67366]">Order Placement</span>
            </h3>
            <p className="text-[9px] text-justify">
              Customers place orders at least 7 days in advance, specifying
              quantities and delivery addresses.
            </p>
            <img
              className="absolute top-20 left-19"
              src="./src/assets/banner2Vector1.png"
            />
          </div>
          <div>
            <img className="size-12/12" src="./src/assets/banner2Logo1.png" />
          </div>
          <div>
            <img className="size-34 ml-6" src="./src/assets/banner2Logo2.png" />
          </div>
          <div className="relative">
            <h3 className="text-[14px] leading-8 font-bold">
              <span className="px-2 py-1 text-[10px] text-white rounded-[20px] bg-[#2C2D5B]">
                2
              </span>
              <span className="mx-2 text-[#F67366]">Selection of Delivery</span>
            </h3>
            <p className="text-[9px] text-justify">
              Goods are allocated to railway trips based on cargo capacity The
              store owner selects the preferred delivery method—railway
              scheduling for bulk transport or last-mile delivery for direct
              customer shipment—based on order requirements and destination.
              product space needs. Excess quantities are scheduled for the next
              available trip.
            </p>
            <img
              className="absolute top-24 right-47 size-8/12"
              src="./src/assets/banner2Vector2.png"
            />
          </div>
          <div>
            <h3 className="text-[14px] leading-8 font-bold">
              <span className="px-2 py-1 text-[10px] text-white rounded-[20px] bg-[#2C2D5B]">
                3
              </span>
              <span className="mx-2 text-[#F67366]">Last-Mile Delivery</span>
            </h3>
            <p className="text-[9px] text-justify">
              Trucks deliver from stores to customer addresses via optimized
              routes, ensuring timely delivery while adhering to driver and
              assistant roster limits.
            </p>
          </div>
          <div className="relative">
            <h3 className="text-[14px]  font-bold">
              <span className="px-2 py-1 text-[10px] text-white rounded-[20px] bg-[#2C2D5B]">
                3
              </span>
              <span className="mx-2 text-[#F67366]">Rail Scheduling</span>
            </h3>
            <p className="text-[9px] text-justify">
              Goods are allocated to railway trips based on cargo capacity and
              product space needs. Excess quantities are scheduled for the next
              available trip.
            </p>
            <img
              className="absolute bottom-13 right-6 size-20"
              src="./src/assets/banner2Vector3.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner2;
