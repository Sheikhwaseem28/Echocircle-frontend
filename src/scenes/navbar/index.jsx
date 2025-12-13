import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu as MenuIcon,
  Close,
  Person,
  Settings,
  Logout,
  ExpandMore,
  Dashboard,
  Home,
} from "@mui/icons-material";
import {
  Bell,
  MessageSquare,
  HelpCircle,
  Search as SearchIcon,
  User,
  ChevronDown,
  Grid,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state/index";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const primaryMain = theme.palette.primary.main;

  const fullName = `${user.firstName} ${user.lastName}`;
  const userInitials = `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    handleProfileMenuClose();
    navigate("/");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Box
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md"
        sx={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Search */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/home")}
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl transition-transform group-hover:scale-105">
                  <MessageSquare size={22} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <Typography
                    className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                  >
                    EchoCircle
                  </Typography>
                  <span className="text-xs text-gray-500 hidden sm:block">Social Network</span>
                </div>
              </div>

              {/* Search Bar - Desktop */}
              {isNonMobileScreens && (
                <div className="relative w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={18} className="text-gray-400" />
                  </div>
                  <InputBase
                    placeholder="Search people, posts, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "8px",
                        fontSize: "14px",
                      }
                    }}
                  />
                  {searchQuery && (
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </div>
              )}
            </div>

            {/* Right Section - Navigation Items */}
            <div className="flex items-center gap-2">
              {/* Navigation Icons */}
              {isNonMobileScreens && (
                <>
                  <Tooltip title="Home">
                    <IconButton
                      onClick={() => navigate("/home")}
                      className="hover:bg-gray-100 rounded-xl"
                      size="medium"
                    >
                      <Home className="text-gray-600" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Dashboard">
                    <IconButton
                      onClick={() => navigate("/dashboard")}
                      className="hover:bg-gray-100 rounded-xl"
                      size="medium"
                    >
                      <LayoutGrid size={20} className="text-gray-600" />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* Messages */}
              <Tooltip title="Messages">
                <IconButton
                  className="hover:bg-gray-100 rounded-xl relative"
                  size="medium"
                >
                  <Badge
                    badgeContent={3}
                    color="error"
                    variant="dot"
                    overlap="circular"
                  >
                    <MessageSquare size={20} className="text-gray-600" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationMenuOpen}
                  className="hover:bg-gray-100 rounded-xl"
                  size="medium"
                >
                  <Badge
                    badgeContent={12}
                    color="error"
                    overlap="circular"
                  >
                    <Bell size={20} className="text-gray-600" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
                <IconButton
                  onClick={() => dispatch(setMode())}
                  className="hover:bg-gray-100 rounded-xl"
                  size="medium"
                >
                  {theme.palette.mode === "dark" ? (
                    <LightMode className="text-amber-500" />
                  ) : (
                    <DarkMode className="text-gray-600" />
                  )}
                </IconButton>
              </Tooltip>

              {/* Help - Desktop Only */}
              {isNonMobileScreens && (
                <Tooltip title="Help & Support">
                  <IconButton
                    className="hover:bg-gray-100 rounded-xl"
                    size="medium"
                  >
                    <HelpCircle size={20} className="text-gray-600" />
                  </IconButton>
                </Tooltip>
              )}

              {/* User Profile */}
              <div className="flex items-center ml-2">
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    className="hover:bg-gray-100 rounded-xl transition-all"
                    size="medium"
                    sx={{
                      padding: "6px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: primaryMain,
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {userInitials}
                      </Avatar>
                      {isNonMobileScreens && (
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-900">
                            {user.firstName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.occupation}
                          </span>
                        </div>
                      )}
                      {isNonMobileScreens && (
                        <ChevronDown 
                          size={16} 
                          className={`text-gray-500 transition-transform ${anchorEl ? 'rotate-180' : ''}`}
                        />
                      )}
                    </div>
                  </IconButton>
                </Tooltip>
              </div>

              {/* Mobile Menu Toggle */}
              {!isNonMobileScreens && (
                <IconButton
                  onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                  className="ml-2"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        {!isNonMobileScreens && isTablet && (
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "6px",
                    fontSize: "14px",
                  }
                }}
              />
            </div>
          </div>
        )}
      </Box>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 280,
            borderRadius: "16px",
            marginTop: "8px",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: primaryMain,
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {userInitials}
            </Avatar>
            <div>
              <Typography className="font-semibold text-gray-900">
                {fullName}
              </Typography>
              <Typography className="text-sm text-gray-500">
                {user.email}
              </Typography>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        <MenuItem onClick={() => { navigate("/profile"); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Person fontSize="small" className="text-gray-600" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem onClick={() => { navigate("/settings"); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" className="text-gray-600" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" className="text-red-500" />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ className: "text-red-600 font-medium" }}
          />
        </MenuItem>
      </Menu>

      {/* Notifications Dropdown Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 360,
            maxHeight: 480,
            borderRadius: "16px",
            marginTop: "8px",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Typography className="font-semibold text-gray-900">
              Notifications
            </Typography>
            <Badge
              badgeContent={12}
              color="error"
              size="small"
            />
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {[1, 2, 3].map((item) => (
            <MenuItem key={item} className="hover:bg-gray-50">
              <div className="flex items-start gap-3 py-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <Typography className="text-sm font-medium text-gray-900">
                    New friend request
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    John Doe wants to connect with you
                  </Typography>
                  <Typography className="text-xs text-gray-400 mt-1">
                    2 hours ago
                  </Typography>
                </div>
              </div>
            </MenuItem>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <Typography 
            className="text-center text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            onClick={handleNotificationMenuClose}
          >
            View all notifications
          </Typography>
        </div>
      </Menu>

      {/* Mobile Menu */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuToggled(false)}
        >
          <Box
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: primaryMain,
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {userInitials}
                </Avatar>
                <div>
                  <Typography className="font-semibold text-gray-900">
                    {user.firstName}
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    {user.occupation}
                  </Typography>
                </div>
              </div>
              <IconButton onClick={() => setIsMobileMenuToggled(false)}>
                <Close />
              </IconButton>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-4 space-y-4">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={18} className="text-gray-400" />
                </div>
                <InputBase
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "8px",
                      fontSize: "14px",
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <MenuItem onClick={() => navigate("/home")} className="rounded-xl">
                  <ListItemIcon>
                    <Home className="text-gray-600" />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </MenuItem>

                <MenuItem onClick={() => navigate("/profile")} className="rounded-xl">
                  <ListItemIcon>
                    <Person className="text-gray-600" />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </MenuItem>

                <MenuItem onClick={() => navigate("/dashboard")} className="rounded-xl">
                  <ListItemIcon>
                    <LayoutGrid size={20} className="text-gray-600" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </MenuItem>

                <MenuItem className="rounded-xl">
                  <ListItemIcon>
                    <MessageSquare size={20} className="text-gray-600" />
                  </ListItemIcon>
                  <ListItemText primary="Messages" />
                  <Badge badgeContent={3} color="error" size="small" />
                </MenuItem>

                <MenuItem className="rounded-xl">
                  <ListItemIcon>
                    <Bell size={20} className="text-gray-600" />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                  <Badge badgeContent={12} color="error" size="small" />
                </MenuItem>

                <MenuItem onClick={() => dispatch(setMode())} className="rounded-xl">
                  <ListItemIcon>
                    {theme.palette.mode === "dark" ? (
                      <LightMode className="text-amber-500" />
                    ) : (
                      <DarkMode className="text-gray-600" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"} 
                  />
                </MenuItem>

                <MenuItem className="rounded-xl">
                  <ListItemIcon>
                    <HelpCircle size={20} className="text-gray-600" />
                  </ListItemIcon>
                  <ListItemText primary="Help & Support" />
                </MenuItem>
              </div>

              <Divider />

              <MenuItem onClick={handleLogout} className="rounded-xl">
                <ListItemIcon>
                  <Logout className="text-red-500" />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ className: "text-red-600 font-medium" }}
                />
              </MenuItem>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navbar;


// import { useState } from "react";
// import {
//   Box,
//   IconButton,
//   InputBase,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Search,
//   Message,
//   DarkMode,
//   LightMode,
//   Notifications,
//   Help,
//   Menu,
//   Close,
// } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { setMode, setLogout } from "../../state/index";
// import { useNavigate } from "react-router-dom";
// import FlexBetween from "../../components/FlexBetween";

// const Navbar = () => {
//   const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user);
//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

//   const theme = useTheme();
//   const neutralLight = theme.palette.neutral.light;
//   const dark = theme.palette.neutral.dark;
//   const background = theme.palette.background.default;
//   const primaryLight = theme.palette.primary.light;
//   const alt = theme.palette.background.alt;

//   const fullName = `${user.firstName} ${user.lastName}`;

//   return (
//     <FlexBetween padding="1rem 6%" backgroundColor={alt}>
//       <FlexBetween gap="1.75rem">
//         <Typography
//           fontWeight="bold"
//           fontSize="clamp(1rem, 2rem, 2.25rem)"
//           color="primary"
//           onClick={() => navigate("/home")}
//           sx={{
//             "&:hover": {
//               color: primaryLight,
//               cursor: "pointer",
//             },
//           }}
//         >
//           EchoCircle
//         </Typography>
//         {isNonMobileScreens && (
//           <FlexBetween
//             backgroundColor={neutralLight}
//             borderRadius="9px"
//             gap="3rem"
//             padding="0.1rem 1.5rem"
//           >
//             <InputBase placeholder="Search..." />
//             <IconButton>
//               <Search />
//             </IconButton>
//           </FlexBetween>
//         )}
//       </FlexBetween>

//       {/* DESKTOP NAV */}
//       {isNonMobileScreens ? (
//         <FlexBetween gap="2rem">
//           <IconButton onClick={() => dispatch(setMode())}>
//             {theme.palette.mode === "dark" ? (
//               <DarkMode sx={{ fontSize: "25px" }} />
//             ) : (
//               <LightMode sx={{ color: dark, fontSize: "25px" }} />
//             )}
//           </IconButton>
//           <Message sx={{ fontSize: "25px" }} />
//           <Notifications sx={{ fontSize: "25px" }} />
//           <Help sx={{ fontSize: "25px" }} />
//           <FormControl variant="standard" value={fullName}>
//             <Select
//               value={fullName}
//               sx={{
//                 backgroundColor: neutralLight,
//                 width: "150px",
//                 borderRadius: "0.25rem",
//                 p: "0.25rem 1rem",
//                 "& .MuiSvgIcon-root": {
//                   pr: "0.25rem",
//                   width: "3rem",
//                 },
//                 "& .MuiSelect-select:focus": {
//                   backgroundColor: neutralLight,
//                 },
//               }}
//               input={<InputBase />}
//             >
//               <MenuItem value={fullName}>
//                 <Typography>{fullName}</Typography>
//               </MenuItem>
//               <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
//             </Select>
//           </FormControl>
//         </FlexBetween>
//       ) : (
//         <IconButton
//           onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
//         >
//           <Menu />
//         </IconButton>
//       )}

//       {/* MOBILE NAV */}
//       {!isNonMobileScreens && isMobileMenuToggled && (
//         <Box
//           position="fixed"
//           right="0"
//           bottom="0"
//           height="100%"
//           zIndex="10"
//           maxWidth="500px"
//           minWidth="300px"
//           backgroundColor={background}
//         >
//           {/* CLOSE ICON */}
//           <Box display="flex" justifyContent="flex-end" p="1rem">
//             <IconButton
//               onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
//             >
//               <Close />
//             </IconButton>
//           </Box>

//           {/* MENU ITEMS */}
//           <FlexBetween
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             gap="3rem"
//           >
//             <IconButton
//               onClick={() => dispatch(setMode())}
//               sx={{ fontSize: "25px" }}
//             >
//               {theme.palette.mode === "dark" ? (
//                 <DarkMode sx={{ fontSize: "25px" }} />
//               ) : (
//                 <LightMode sx={{ color: dark, fontSize: "25px" }} />
//               )}
//             </IconButton>
//             <Message sx={{ fontSize: "25px" }} />
//             <Notifications sx={{ fontSize: "25px" }} />
//             <Help sx={{ fontSize: "25px" }} />
//             <FormControl variant="standard" value={fullName}>
//               <Select
//                 value={fullName}
//                 sx={{
//                   backgroundColor: neutralLight,
//                   width: "150px",
//                   borderRadius: "0.25rem",
//                   p: "0.25rem 1rem",
//                   "& .MuiSvgIcon-root": {
//                     pr: "0.25rem",
//                     width: "3rem",
//                   },
//                   "& .MuiSelect-select:focus": {
//                     backgroundColor: neutralLight,
//                   },
//                 }}
//                 input={<InputBase />}
//               >
//                 <MenuItem value={fullName}>
//                   <Typography>{fullName}</Typography>
//                 </MenuItem>
//                 <MenuItem onClick={() => dispatch(setLogout())}>
//                   Log Out
//                 </MenuItem>
//               </Select>
//             </FormControl>
//           </FlexBetween>
//         </Box>
//       )}
//     </FlexBetween>
//   );
// };

// export default Navbar;
