import { Button } from "~/components/ui/button";

interface MainButtonProps {
  name: string;
  textColor: string;
  bgColor: string;
  borderColor?: string;
  paddingX: string;
  paddingY: string;
  textSize?: string;
  onClick?: () => void;
}

const MainButton = ({
  name,
  textColor,
  bgColor,
  borderColor,
  paddingX,
  paddingY,
  onClick,
}: MainButtonProps) => {
  return (
    <div>
      <Button
        variant="outline"
        className="px-7 py-2 font-medium rounded-sm cursor-pointer text-[8px] sm:text-[11px] md:text-[15px]"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor || bgColor}`,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          paddingLeft: paddingX,
          paddingRight: paddingX,
        }}
        onClick={onClick}
      >
        {name}
      </Button>
    </div>
  );
};

export default MainButton;
