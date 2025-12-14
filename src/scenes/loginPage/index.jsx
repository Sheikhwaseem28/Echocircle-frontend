import Form from "./Form";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Top brand bar */}
      <div className="w-full border-b border-red-900/70 bg-black/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-700 bg-gradient-to-br from-red-600/70 to-red-800/40 shadow-[0_0_25px_rgba(248,113,113,0.35)]">
              <span className="text-xs font-semibold tracking-[0.2em] text-black">
                EC
              </span>
            </div>
            <h1 className="text-xl font-semibold tracking-wide text-neutral-50">
              EchoCircle
            </h1>
          </div>

          <p className="hidden text-xs text-neutral-400 sm:block">
            Join the conversation. In your own echo.
          </p>
        </div>
      </div>

      {/* Auth section */}
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center px-4 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Left intro panel (purely visual, no extra feature) */}
          <div className="hidden flex-col justify-center gap-4 lg:flex">
            <h2 className="text-3xl font-semibold leading-tight text-neutral-50">
              Welcome to{" "}
              <span className="text-red-500">
                EchoCircle
              </span>
              .
            </h2>
            <p className="max-w-md text-sm text-neutral-400">
              Connect with your circle in a focused, distraction‑free space
              designed for clarity and real conversations.
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs text-neutral-400">
              <span className="inline-flex h-7 items-center rounded-full border border-red-800/70 bg-red-900/20 px-3 text-[11px] font-medium text-red-300">
                • Minimal dark UI
              </span>
              <span className="inline-flex h-7 items-center rounded-full border border-red-800/70 bg-red-900/20 px-3 text-[11px] font-medium text-red-300">
                • Mobile‑first experience
              </span>
            </div>
          </div>

          {/* Auth card with Form (unchanged logic) */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-red-900/70 bg-neutral-950/95 px-6 py-8 shadow-[0_0_40px_rgba(127,29,29,0.45)] backdrop-blur-sm sm:px-8">
              <h2 className="mb-2 text-xl font-medium text-neutral-50">
                Welcome to{" "}
                <span className="text-red-500">
                  EchoCircle
                </span>
                !
              </h2>
              <p className="mb-6 text-xs text-neutral-400">
                Sign in or continue to create your account and start echoing
                with your people.
              </p>

              {/* Your existing form component */}
              <Form />

              <p className="mt-4 text-[11px] text-neutral-500">
                By continuing, you agree to EchoCircle’s terms and acknowledge
                the privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



// import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
// import Form from "./Form";

// const LoginPage = () => {
//   const theme = useTheme();
//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
//   return (
//     <Box>
//       <Box
//         width="100%"
//         backgroundColor={theme.palette.background.alt}
//         p="1rem 6%"
//         textAlign="center"
//       >
//         <Typography fontWeight="bold" fontSize="32px" color="primary">
//          EchoCircle
//         </Typography>
//       </Box>

//       <Box
//         width={isNonMobileScreens ? "50%" : "93%"}
//         p="2rem"
//         m="2rem auto"
//         borderRadius="1.5rem"
//         backgroundColor={theme.palette.background.alt}
//       >
//         <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
//           Welcome to EchoCircle!
//         </Typography>
//         <Form />
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;
