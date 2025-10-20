const Banner2 = () => {
  return (
    <div className="min-h-[59dvh] md:min-h-[67dvh] mt-0 mb-7 sm:mb-12 w-full">
      <div className="mx-3.5 sm:mx-8 md:mx-6">
        <div className="lg:mb-0 flex flex-row justify-center items-center gap-4 mb-[-10px]">
          <div className="flex-1 sm:flex-[2]">
            <img
              className="size-15 md:w-20 md:h-20"
              src="/banner1Logo.png"
              alt="logo"
            />
          </div>
          <div className="flex-2 sm:flex-[3]">
            <span className="text-[14px] sm:text-[14.5px] md:text-[22px] lg:text-[32px] font-semibold underline decoration-[#F67366] decoration-2 underline-offset-7">
              Operation
            </span>
            <span className="text-[14px] sm:text-[14.5px] md:text-[22px] lg:text-[32px] font-light ml-1.5">
              Mode
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-10 sm:gap-y-0 gap-x-5 lg:gap-x-8 items-center">
          <div className="hover-animate-section relative">
            <h3 className="text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-6 md:leading-10 lg:leading-12 font-bold">
              <span className="px-2 py-1 text-[10px] sm:text-[12px] md:text-[14px] text-white rounded-[20px] bg-[#2C2D5B]">
                1
              </span>
              <span className="mx-2 text-[#F67366]">Order Placement</span>
            </h3>
            <p className="text-[9px] sm:text-[10.5px] md:text-[12px] lg:text-[18px] leading-3 md:leading-3.5 lg:leading-6 text-justify">
              Customers place orders at least 7 days in advance, specifying
              quantities and delivery addresses.
            </p>
            <img
              className="absolute top-20 left-19 lg:top-32"
              src="/banner2Vector1.png"
              alt="vector"
            />
          </div>
          <div>
            <img
              className="size-12/12 lg:h-90 lg:w-150 "
              src="/banner2Logo1.png"
              alt="order placement"
            />
          </div>
          <div>
            <img
              className="size-31 ml-6 sm:size-45 md:size-55 sm:mb-9 lg:size-95"
              src="/banner2Logo2.png"
              alt="selection"
            />
          </div>
          <div className="relative sm:mb-9">
            <h3 className="text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-6 md:leading-10 lg:leading-12 font-bold">
              <span className="px-2 py-1 text-[10px] sm:text-[12px] md:text-[14px] text-white rounded-[20px] bg-[#2C2D5B]">
                2
              </span>
              <span className="ml-2 text-[#F67366]">Selection of Delivery</span>
            </h3>
            <p className="text-[9px] sm:text-[10.5px] md:text-[12px] lg:text-[18px] leading-3 md:leading-3.5 lg:leading-6 text-justify">
              Goods are allocated to railway trips based on cargo capacity. The
              store owner selects the preferred delivery method—railway
              scheduling for bulk transport or last-mile delivery for direct
              customer shipment—based on order requirements and destination.
              Excess quantities are scheduled for the next available trip.
            </p>
            <img
              className="absolute top-24 right-47 size-8/12 sm:top-30 sm:right-55 md:size-10/12 lg:size-12/12 lg:right-85 lg:top-45"
              src="/banner2Vector2.png"
              alt="vector"
            />
          </div>
          <div>
            <h3 className="text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-6 md:leading-10 lg:leading-12 font-bold">
              <span className="px-2 py-1 text-[10px] sm:text-[12px] md:text-[14px] text-white rounded-[20px] bg-[#2C2D5B]">
                3
              </span>
              <span className="ml-2 text-[#F67366]">Last-Mile Delivery</span>
            </h3>
            <p className="text-[9px] sm:text-[10.5px] md:text-[12px] lg:text-[18px] leading-3 md:leading-3.5 lg:leading-6 text-justify">
              Trucks deliver from stores to customer addresses via optimized
              routes, ensuring timely delivery while adhering to driver and
              assistant roster limits.
            </p>
          </div>
          <div className="relative">
            <h3 className="text-[10px] sm:text-[11px] md:text-[14px] lg:text-[22px] leading-6 md:leading-10 lg:leading-12 font-bold">
              <span className="px-2 py-1 text-[10px] sm:text-[12px] md:text-[14px] text-white rounded-[20px] bg-[#2C2D5B]">
                4
              </span>
              <span className="ml-2 text-[#F67366]">Rail Scheduling</span>
            </h3>
            <p className="text-[9px] sm:text-[10.5px] md:text-[12px] lg:text-[18px] leading-3 md:leading-3.5 lg:leading-6 text-justify">
              Goods are allocated to railway trips based on cargo capacity and
              product space needs. Excess quantities are scheduled for the next
              available trip.
            </p>
            <img
              className="absolute bottom-13 right-6 size-20 md:size-29 lg:size-50 lg:bottom-20"
              src="/banner2Vector3.png"
              alt="vector"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner2;
