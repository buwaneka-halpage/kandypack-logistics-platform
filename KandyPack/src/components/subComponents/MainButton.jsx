import { Button } from "@/components/ui/button";

const MainButton = ({
  name,
  textColor,
  bgColor,
  borderColor,
  paddingX,
  paddingY,
  textSize,
}) => {
  return (
    <div>
      <Button
        variant="outline"
        className="px-7 py-2 font-medium rounded-sm cursor-pointer"
        style={{
          color: `${textColor}`,
          backgroundColor: `${bgColor}`,
          border: `1px solid ${borderColor}`,
          paddingTop: `${paddingY}`,
          paddingBottom: `${paddingY}`,
          paddingLeft: `${paddingX}`,
          paddingRight: `${paddingX}`,
          fontSize: `${textSize}`,
        }}
      >
        {name}
      </Button>
    </div>
  );
};

export default MainButton;
