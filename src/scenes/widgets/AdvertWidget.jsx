import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const { dark, main, medium } = palette.neutral;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      
      {/* Replace with a local image or shorter URL */}
      <div style={{
        backgroundColor: palette.neutral.light,
        borderRadius: "0.75rem",
        margin: "0.75rem 0",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Typography color={medium}>Ad Space</Typography>
      </div>
      
      <FlexBetween>
        <Typography color={main}>Protien</Typography>
        <Typography color={medium}>supplements.com</Typography>
      </FlexBetween>
      
      <Typography color={medium} m="0.5rem 0">
        Fuel your muscles with the highest quality whey protein on the market...
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;