import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

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
      
      <img
        src="https://echocircle-backend.vercel.app/assets/info4.jpg"
        alt="advert"
        width="100%"
        height="auto"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      
      <FlexBetween>
        <Typography color={main}>Protien</Typography>
        <Typography color={medium}>supplements.com</Typography>
      </FlexBetween>
      
      <Typography color={medium} m="0.5rem 0">
      Fuel your muscles with the highest quality whey protein on the market. Whey Protein provides 24g of protein per serving, helping you recover faster and build lean muscle mass. Our delicious flavors make it easy to stick to your fitness routine. Whether you're bulking up or cutting down, [Brand Name] has got you covered.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
