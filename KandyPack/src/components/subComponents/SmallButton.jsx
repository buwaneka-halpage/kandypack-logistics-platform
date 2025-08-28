const SmallButton = ({
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
      <button
        className="font-medium rounded-sm mx-1 cursor-pointer"
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
      </button>
    </div>
  );
};

export default SmallButton;
