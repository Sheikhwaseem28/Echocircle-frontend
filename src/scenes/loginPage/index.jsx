import { Box, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { 
  MessageSquare, 
  Users, 
  Sparkles, 
  ChevronRight,
  Home,
  Globe,
  Shield,
  Heart
} from "lucide-react";

const LoginPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Modern Header */}
      <Box
        className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm"
        p="1.5rem 6%"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <MessageSquare size={24} className="text-white" />
              </div>
              <div>
                <Typography 
                  className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                >
                  EchoCircle
                </Typography>
                <p className="text-xs text-gray-500">Connect • Share • Inspire</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} />
                  <span className="text-sm">10K+ Members</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe size={16} />
                  <span className="text-sm">Global Community</span>
                </div>
              </div>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </Box>

      {/* Main Content */}
      <Box className="w-full px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <Home size={16} />
              <ChevronRight size={14} />
              <span className="text-sm font-medium text-gray-600">Authentication</span>
              <ChevronRight size={14} />
              <span className="text-sm text-gray-400">Access Portal</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Welcome to <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">EchoCircle</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Join our vibrant community where meaningful connections happen. 
                  Share experiences, discover friends, and grow together.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <Sparkles size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Access</p>
                  <p className="text-xs text-gray-500">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Global Network</h3>
                  <p className="text-sm text-gray-600">
                    Connect with thousands of professionals worldwide
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Shield size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                  <p className="text-sm text-gray-600">
                    Your data is protected with end-to-end encryption
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Heart size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Engage & Grow</h3>
                  <p className="text-sm text-gray-600">
                    Share ideas and grow your professional network
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Auth Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">Why EchoCircle?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-700">Real-time connections</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Secure communication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-700">Professional networking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-700">Knowledge sharing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                    <span className="text-sm text-gray-700">Community support</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-3">Trusted by professionals at</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">Google</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">Microsoft</span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">Amazon</span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg">Apple</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Need help?</span> Contact our support team
                  </div>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 h-20 w-20 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
                
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                  {/* Form Header */}
                  <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Get Started Today</h2>
                        <p className="text-gray-600 mt-1">
                          Sign in or create your account in seconds
                        </p>
                      </div>
                      <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                    </div>
                  </div>
                  
                  {/* Form Content */}
                  <div className="p-8">
                    <Form />
                  </div>
                  
                  {/* Form Footer */}
                  <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">100% Secure</span> • SSL Encrypted
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs text-gray-600">System Active</span>
                        </div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="text-xs text-gray-500">
                          Version 2.4.1 • Last updated: Today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">New to EchoCircle?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Create an account to unlock all features and join our growing community.
                  </p>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Learn more about benefits <ChevronRight size={14} />
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Enterprise Solutions</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Looking for team collaboration tools? Explore our enterprise plans.
                  </p>
                  <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    Contact sales <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>

      {/* Footer */}
      <Box className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-900">EchoCircle © 2024</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <span className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">Privacy Policy</span>
              <span className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">Terms of Service</span>
              <span className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">Cookie Policy</span>
              <span className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">Contact Us</span>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default LoginPage;

// Typography component for consistency
const Typography = ({ children, className, ...props }) => {
  return (
    <p className={className} {...props}>
      {children}
    </p>
  );
};


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
