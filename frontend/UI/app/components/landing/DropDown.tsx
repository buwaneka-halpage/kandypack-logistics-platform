import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropDownProps {
  name: string;
  textColor: string;
  textSize: string;
}

const DropDown = ({ name, textColor, textSize }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className={`px-2 py-2 focus:outline-none focus:ring-0 border-none cursor-default ${textSize}`}
          style={{ color: textColor }}
          onClick={toggleDropdown}
        >
          {name} <ChevronDown className="inline-block w-3 h-3 ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[200] bg-white border-none shadow-lg/30 shadow-gray-400 ">
          <DropdownMenuItem className={textSize}>About Us</DropdownMenuItem>
          <DropdownMenuItem className={textSize}>Our Mission</DropdownMenuItem>
          <DropdownMenuItem className={textSize}>Our Team</DropdownMenuItem>
          <DropdownMenuItem className={textSize}>Contact</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDown;
