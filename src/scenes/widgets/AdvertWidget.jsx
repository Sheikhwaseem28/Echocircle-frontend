const AdvertWidget = () => {
  return (
    <div className="rounded-2xl border border-red-900/70 bg-neutral-950/90 p-4 text-neutral-100 shadow-[0_0_28px_rgba(127,29,29,0.45)]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Sponsored
        </h2>
        <button className="text-xs font-medium text-red-400 hover:text-red-300">
          Create Ad
        </button>
      </div>

      {/* Ad space */}
      <div className="mb-3 flex h-40 items-center justify-center rounded-xl border border-red-900/60 bg-black/80 text-xs text-neutral-500">
        Ad Space
      </div>

      {/* Footer info */}
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-100">Protein</span>
        <span className="text-neutral-400">supplements.com</span>
      </div>

      <p className="text-[11px] leading-relaxed text-neutral-400">
        Fuel your muscles with the highest quality whey protein on the market...
      </p>
    </div>
  );
};

export default AdvertWidget;



// import { Typography, useTheme } from "@mui/material";
// import FlexBetween from "../../components/FlexBetween";
// import WidgetWrapper from "../../components/WidgetWrapper";

// const AdvertWidget = () => {
//   const { palette } = useTheme();
//   const { dark, main, medium } = palette.neutral;

//   return (
//     <WidgetWrapper>
//       <FlexBetween>
//         <Typography color={dark} variant="h5" fontWeight="500">
//           Sponsored
//         </Typography>
//         <Typography color={medium}>Create Ad</Typography>
//       </FlexBetween>
      
//       {/* Replace with a local image or shorter URL */}
//       <div style={{
//         backgroundColor: palette.neutral.light,
//         borderRadius: "0.75rem",
//         margin: "0.75rem 0",
//         height: "200px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}>
//         <Typography color={medium}>Ad Space</Typography>
//       </div>
      
//       <FlexBetween>
//         <Typography color={main}>Protien</Typography>
//         <Typography color={medium}>supplements.com</Typography>
//       </FlexBetween>
      
//       <Typography color={medium} m="0.5rem 0">
//         Fuel your muscles with the highest quality whey protein on the market...
//       </Typography>
//     </WidgetWrapper>
//   );
// };

// export default AdvertWidget;