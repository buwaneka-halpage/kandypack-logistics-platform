import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const DropDown = ({ name, textColor, textSize }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="px-2 py-2 focus:outline-none focus:ring-0 border-none cursor-default"
          style={{ color: `${textColor}`, fontSize: `${textSize}` }}
        >
          {name} <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem style={{ fontSize: `${textSize}` }}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem style={{ fontSize: `${textSize}` }}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem style={{ fontSize: `${textSize}` }}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem style={{ fontSize: `${textSize}` }}>
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDown;
