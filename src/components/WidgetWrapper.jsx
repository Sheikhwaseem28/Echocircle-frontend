const WidgetWrapper = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-red-900/70 bg-neutral-950/95 p-6 pb-3 shadow-[0_0_28px_rgba(127,29,29,0.45)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default WidgetWrapper;



// import { Box } from "@mui/material";
// import { styled } from "@mui/system";

// const WidgetWrapper = styled(Box)(({ theme }) => ({
//   padding: "1.5rem 1.5rem 0.75rem 1.5rem",
//   backgroundColor: theme.palette.background.alt,
//   borderRadius: "0.75rem",
// }));

// export default WidgetWrapper;