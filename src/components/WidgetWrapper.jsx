import { Box } from "@mui/material";
import { styled } from "@mui/system";

// Simple, clean WidgetWrapper for JSX
const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
}));

// Additional styled variants for common use cases
export const WidgetCard = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "20px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
}));

export const WidgetPanel = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: theme.palette.grey[50],
  borderRadius: "12px",
  border: `1px solid ${theme.palette.grey[200]}`,
}));

export const WidgetGlass = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border: `1px solid rgba(255, 255, 255, 0.3)`,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

export const WidgetCompact = styled(Box)(({ theme }) => ({
  padding: "1rem",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
}));

export default WidgetWrapper;


// import { Box } from "@mui/material";
// import { styled } from "@mui/system";

// const WidgetWrapper = styled(Box)(({ theme }) => ({
//   padding: "1.5rem 1.5rem 0.75rem 1.5rem",
//   backgroundColor: theme.palette.background.alt,
//   borderRadius: "0.75rem",
// }));

// export default WidgetWrapper;