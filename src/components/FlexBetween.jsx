import { Box } from "@mui/material";
import { styled } from "@mui/system";

// Simple version that works perfectly in JSX
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

// Additional flex variants if needed
export const FlexCenter = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

export const FlexStart = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center"
});

export const FlexEnd = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center"
});

export const FlexColumn = styled(Box)({
  display: "flex",
  flexDirection: "column"
});

export const FlexColumnBetween = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
});

export default FlexBetween;


// import { Box } from "@mui/material";
// import { styled } from "@mui/system";

// const FlexBetween = styled(Box)({
// display:"flex",
// justifyContent: "space-between",
// alignItems: "center"
// });

// export default FlexBetween;