interface SmallButtonProps {
  name: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  paddingX: string;
  paddingY: string;
  textSize?: string;
  onClick?: () => void;
}

const SmallButton = ({
  name,
  textColor,
  bgColor,
  borderColor,
  paddingX,
  paddingY,
  onClick,
}: SmallButtonProps) => {
  return (
    <div>
      <button
        className="font-medium rounded-sm mx-1 cursor-pointer text-[8px] sm:text-[11px] md:text-[15px] lg:text-[14px]"
        style={{
          color: textColor,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          paddingLeft: paddingX,
          paddingRight: paddingX,
        }}
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
};

export default SmallButton;
