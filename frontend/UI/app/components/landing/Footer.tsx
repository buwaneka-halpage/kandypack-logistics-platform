const Footer = () => {
  return (
    <div className="lg:pt-4 min-h-[12dvh] lg:min-h-[20dvh] relative bg-[#2C2D5B] w-full">
      <div className="mx-3.5 sm:mx-8 flex flex-col justify-center items-center">
        <div className="flex-1 flex flex-row justify-center items-start pt-2 gap-x-8 md:gap-x-25 min-h-[7.5dvh]">
          <div className="flex-3">
            <h3 className="text-[8px] sm:text-[12px] lg:text-[16px] cursor-default font-semibold">
              <span style={{ color: "white" }}>Kandy</span>
              <span style={{ color: "#F67366" }}>Pack</span>
            </h3>
            <p
              className="text-[7px] sm:text-[10px] lg:text-[13px] leading-2 sm:leading-2.5 lg:leading-4 my-1 font-light text-left"
              style={{ color: "white" }}
            >
              KandyPack delivers unparalleled customer service through dedicated
              customer teams, engaged people working in an agile culture, and an
              island-wide footprint.
            </p>
          </div>
          <div className="flex-1 text-[8px] sm:text-[12px] cursor-default text-white">
            <h3 className="font-bold lg:text-[16px]">Explore</h3>
            <nav className="flex flex-col justify-center items-start my-1 text-[7px] leading-3 lg:leading-5">
              <a className="cursor-pointer sm:text-[10px] lg:text-[13px]">
                About Us
              </a>
              <a className="cursor-pointer sm:text-[10px] lg:text-[13px]">
                Gallery
              </a>
              <a className="cursor-pointer sm:text-[10px] lg:text-[13px]">
                News & Media
              </a>
            </nav>
          </div>
          <div className="flex-1 text-[8px] sm:text-[12px] cursor-default text-white">
            <h3 className="font-bold lg:text-[16px]">Legal</h3>
            <nav className="flex flex-col justify-center items-start my-1 text-[7px] leading-3 lg:leading-5">
              <a className="cursor-pointer sm:text-[10px] lg:text-[13px]">
                Terms
              </a>
              <a className="cursor-pointer sm:text-[10px] lg:text-[13px]">
                Privacy
              </a>
            </nav>
          </div>
          <div className="flex-3 text-[8px] sm:text-[12px] cursor-default text-white">
            <h3 className="font-bold lg:text-[16px]">Social Media</h3>
            <div className="flex flex-row justify-start items-center my-1 gap-x-1 lg:gap-x-4">
              <img
                className="size-5 lg:size-10"
                src="/facebookIcon.png"
                alt="Facebook"
              />
              <img
                className="size-5 lg:size-10"
                src="/twitterIcon.png"
                alt="Twitter"
              />
              <img
                className="size-5 lg:size-10"
                src="/whatsappIcon.png"
                alt="WhatsApp"
              />
              <img
                className="size-5 lg:size-10"
                src="/instagramIcon.png"
                alt="Instagram"
              />
            </div>
          </div>
        </div>
        <div className="flex-5 w-full min-h-[5dvh] sm:min-h-[14dvh] md:min-h-[5dvh] lg:min-h-[10dvh]">
          <hr
            style={{ border: "0.5px solid white" }}
            className="mt-[8px] lg:mt-[16px]"
          />
          <h1 className="font-semibold text-[8px] sm:text-[10px] lg:text-[13px] text-[#F67366] absolute bottom-4 left-[45%]">
            KandyPack.lk
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
