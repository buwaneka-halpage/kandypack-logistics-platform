import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas, faTextWidth } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const Banner3 = () => {
  return (
    <div className="h-[44.7dvh]">
      <div className="h-[44.7dvh]">
        <img src="./src/assets/banner3Bg.png" />
      </div>
    </div>
  );
};

export default Banner3;
