const SmallButton = ({
  name,
  textColor,
  bgColor,
  borderColor,
  paddingX,
  paddingY,
  textSize,
  border,
}) => {
  return (
    <div>
      <button
        className="px-7 py-2 mx-4 font-medium rounded-sm cursor-pointer"
        style={{
          color: `${textColor}`,
          backgroundColor: `${bgColor}`,
          border: `1px solid ${borderColor}`,
          paddingTop: `${paddingY}`,
          paddingBottom: `${paddingY}`,
          paddingLeft: `${paddingX}`,
          paddingRight: `${paddingX}`,
          fontSize: `${textSize}`,
          border: `${border}`,
        }}
      >
        {name}
      </button>
    </div>
  );
};

export default SmallButton;
