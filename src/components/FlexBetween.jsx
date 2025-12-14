const FlexBetween = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default FlexBetween;



// import { Box } from "@mui/material";
// import { styled } from "@mui/system";

// const FlexBetween = styled(Box)({
// display:"flex",
// justifyContent: "space-between",
// alignItems: "center"
// });

// export default FlexBetween;