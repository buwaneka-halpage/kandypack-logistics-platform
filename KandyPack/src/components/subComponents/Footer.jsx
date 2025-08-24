const Footer = () => {
  return (
    <div className="h-[12dvh] relative bg-[#2C2D5B]">
      <div className="h-[12dvh] mx-3.5 flex flex-col justify-center items-center">
        <div className="flex-1 flex flex-row justify-center items-start pt-2 gap-x-8 h-[7.5dvh]">
          <div className="flex-3">
            <h3 className="text-[8px] cursor-default font-semibold">
              <span style={{ color: "white" }}>Kandy</span>
              <span style={{ color: "#F67366" }}>Pack</span>
            </h3>
            <p
              className="text-[7px] leading-2 my-1 font-light text-left"
              style={{ color: "white" }}
            >
              KandyPack delivers unparalleled customer service through dedicated
              customer teams, engaged people working in an agile culture, and an
              island-wide footprint.
            </p>
          </div>
          <div className="flex-1 text-[8px] cursor-default text-white">
            <h3 className="font-bold">Explore</h3>
            <nav className="flex flex-col justify-center items-start my-1 text-[7px] leading-3">
              <a className="cursor-pointer">About Us</a>
              <a className="cursor-pointer">Gallery</a>
              <a className="cursor-pointer">News & Media</a>
            </nav>
          </div>
          <div className="flex-1 text-[8px] cursor-default text-white">
            <h3 className="font-bold">Legal</h3>
            <nav className="flex flex-col justify-center items-start my-1 text-[7px] leading-3">
              <a className="cursor-pointer">Terms</a>
              <a className="cursor-pointer">Privacy</a>
            </nav>
          </div>
          <div className="flex-3 text-[8px] cursor-default text-white">
            <h3 className="font-bold">Social Media</h3>
            <div className="flex flex-row justify-start items-center my-1 gap-x-1">
              <img className="size-5" src="./src/assets/facebookIcon.png" />
              <img className="size-5" src="./src/assets/twitterIcon.png" />
              <img className="size-5" src="./src/assets/whatsappIcon.png" />
              <img className="size-5" src="./src/assets/instagramIcon.png" />
            </div>
          </div>
        </div>
        <div className="flex-5 w-full h-[7.5dvh]">
          <hr style={{ border: "0.5px solid white", marginTop: "8px" }} />
          <h1 className="font-semibold text-[8px] text-[#F67366] absolute bottom-1 left-[43%]">
            KandyPack.lk
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
