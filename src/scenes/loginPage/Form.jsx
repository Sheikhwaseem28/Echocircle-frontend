
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";
import Dropzone from "react-dropzone";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Home,
  Users,
} from "lucide-react";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])/, "Must contain uppercase and lowercase letters")
    .required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.mixed().test("fileRequired", "Profile picture is required", (value) => {
    return value !== null && value !== undefined;
  }),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:768px)");
  const isTablet = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const showAlert = (message, severity = "error") => {
    setAlert({ open: true, message, severity });
  };

  const register = async (values, onSubmitProps) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("location", values.location);
      formData.append("occupation", values.occupation);
      
      if (values.picture) {
        formData.append("picture", values.picture);
      }

      const response = await fetch("https://echocircle-backend.vercel.app/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Registration failed with status: ${response.status}`);
      }

      if (result.success) {
        showAlert(result.message || "Registration successful! Please login.", "success");
        onSubmitProps.resetForm();
        setPageType("login");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showAlert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (values, onSubmitProps) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://echocircle-backend.vercel.app/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Login failed: ${response.status}`);
      }

      if (result.token && result.user) {
        dispatch(
          setLogin({
            user: result.user,
            token: result.token,
          })
        );
        showAlert("Login successful!", "success");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
      onSubmitProps.resetForm();
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) {
      await login(values, onSubmitProps);
    } else if (isRegister) {
      await register(values, onSubmitProps);
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlert({ ...alert, open: false })} 
          severity={alert.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '12px'
          }}
          icon={
            alert.severity === "success" ? <CheckCircle size={20} /> : undefined
          }
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div className="w-full max-w-4xl mx-auto">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Home size={16} />
            <ChevronRight size={14} />
            <span className="text-sm">Authentication</span>
            <ChevronRight size={14} />
            <span className="text-sm font-medium text-gray-600">
              {isLogin ? "Login" : "Register"}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Join EchoCircle"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isLogin 
                  ? "Sign in to your account to continue" 
                  : "Create your account and start connecting"}
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-xl ${isLogin ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'} flex items-center gap-2`}>
              {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              <span className="text-sm font-medium">
                {isLogin ? "Login Mode" : "Registration Mode"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Why Join EchoCircle?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Connect with Friends</p>
                    <p className="text-xs text-gray-600">Build your professional network</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Briefcase size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Share Experiences</p>
                    <p className="text-xs text-gray-600">Post updates and engage with community</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Discover People</p>
                    <p className="text-xs text-gray-600">Find people with similar interests</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-blue-200">
                <div className="text-sm text-gray-600 mb-2">Already have an account?</div>
                <button
                  onClick={() => {
                    if (!isLoading) {
                      setPageType(isLogin ? "register" : "login");
                    }
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isLogin ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      {isLogin ? <UserPlus size={16} className="text-emerald-600" /> : <LogIn size={16} className="text-blue-600" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {isLogin ? "Create Account" : "Sign In"}
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isLogin ? "Sign In to Your Account" : "Create New Account"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {isLogin 
                        ? "Enter your credentials to access your account"
                        : "Fill in your details to create an account"
                      }
                    </p>
                  </div>
                  <div className={`h-10 w-1.5 rounded-full ${isLogin ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <Formik
                  onSubmit={handleFormSubmit}
                  initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
                  validationSchema={isLogin ? loginSchema : registerSchema}
                  validateOnBlur={true}
                  validateOnChange={true}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm,
                    isValid,
                  }) => (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isRegister && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                First Name
                              </label>
                              <TextField
                                fullWidth
                                placeholder="John"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.firstName}
                                name="firstName"
                                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                                disabled={isLoading}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <User size={18} className="text-gray-400" />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                  }
                                }}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Last Name
                              </label>
                              <TextField
                                fullWidth
                                placeholder="Doe"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lastName}
                                name="lastName"
                                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                helperText={touched.lastName && errors.lastName}
                                disabled={isLoading}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <User size={18} className="text-gray-400" />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                  }
                                }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Location
                              </label>
                              <TextField
                                fullWidth
                                placeholder="New York, USA"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.location}
                                name="location"
                                error={Boolean(touched.location) && Boolean(errors.location)}
                                helperText={touched.location && errors.location}
                                disabled={isLoading}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <MapPin size={18} className="text-gray-400" />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                  }
                                }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Occupation
                              </label>
                              <TextField
                                fullWidth
                                placeholder="Software Developer"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.occupation}
                                name="occupation"
                                error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                helperText={touched.occupation && errors.occupation}
                                disabled={isLoading}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Briefcase size={18} className="text-gray-400" />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                  }
                                }}
                              />
                            </div>

                            {/* Picture Upload Section */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Profile Picture
                              </label>
                              <Dropzone
                                accept={{
                                  'image/jpeg': ['.jpeg', '.jpg'],
                                  'image/png': ['.png']
                                }}
                                maxFiles={1}
                                maxSize={5242880}
                                onDrop={(acceptedFiles) => {
                                  if (acceptedFiles.length > 0 && !isLoading) {
                                    setFieldValue("picture", acceptedFiles[0]);
                                  }
                                }}
                                disabled={isLoading}
                              >
                                {({ getRootProps, getInputProps, isDragActive }) => (
                                  <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                                      errors.picture && touched.picture 
                                        ? 'border-red-300 bg-red-50' 
                                        : isDragActive 
                                        ? 'border-blue-300 bg-blue-50' 
                                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                    } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center gap-3">
                                      <div className={`p-3 rounded-full ${
                                        values.picture 
                                          ? 'bg-green-100 text-green-600' 
                                          : 'bg-blue-100 text-blue-600'
                                      }`}>
                                        {values.picture ? <CheckCircle size={24} /> : <Upload size={24} />}
                                      </div>
                                      <div>
                                        {!values.picture ? (
                                          <>
                                            <p className="text-gray-900 font-medium">
                                              {isDragActive ? 'Drop the image here' : 'Upload Profile Picture'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                              Drag & drop or click to browse
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                              JPG, PNG up to 5MB
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p className="text-gray-900 font-medium">{values.picture.name}</p>
                                            <p className="text-sm text-gray-500">
                                              {(values.picture.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                          </>
                                        )}
                                      </div>
                                      {!values.picture && (
                                        <button
                                          type="button"
                                          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          Browse files
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              {errors.picture && touched.picture && (
                                <p className="mt-2 text-sm text-red-600">{errors.picture}</p>
                              )}
                            </div>
                          </>
                        )}

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Email Address
                          </label>
                          <TextField
                            fullWidth
                            placeholder="you@example.com"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            type="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            disabled={isLoading}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Mail size={18} className="text-gray-400" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                              }
                            }}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Password
                          </label>
                          <TextField
                            fullWidth
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            disabled={isLoading}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock size={18} className="text-gray-400" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    disabled={isLoading}
                                    size="small"
                                  >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button
                          fullWidth
                          type="submit"
                          disabled={isLoading || (isRegister && !isValid)}
                          variant="contained"
                          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                          sx={{
                            py: 2,
                            borderRadius: '12px',
                            backgroundColor: isLogin ? palette.primary.main : palette.success.main,
                            fontSize: '16px',
                            fontWeight: '600',
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                            '&:hover': {
                              backgroundColor: isLogin ? palette.primary.dark : palette.success.dark,
                              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
                              transform: 'translateY(-1px)',
                            },
                            '&:active': {
                              transform: 'translateY(0)',
                            },
                            '&:disabled': {
                              backgroundColor: palette.grey[300],
                              color: palette.grey[500],
                              boxShadow: 'none',
                              transform: 'none',
                            }
                          }}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <CircularProgress size={20} color="inherit" />
                              {isLogin ? 'Signing In...' : 'Creating Account...'}
                            </span>
                          ) : isLogin ? 'Sign In to Account' : 'Create Account'}
                        </Button>

                        {isRegister && (
                          <div className="mt-4">
                            <div className="text-xs text-gray-500 mb-2">
                              Password requirements:
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className={`flex items-center gap-1 ${values.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${values.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-xs">At least 6 characters</span>
                              </div>
                              <div className={`flex items-center gap-1 ${/^(?=.*[a-z])(?=.*[A-Z])/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${/^(?=.*[a-z])(?=.*[A-Z])/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-xs">Upper & lowercase</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  )}
                </Formik>
              </div>

              {/* Form Footer */}
              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {isLogin ? 'Secure Login' : 'Account Creation'}
                    </span> • Your data is protected
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-gray-600">System Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;

// import { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   useMediaQuery,
//   Typography,
//   useTheme,
//   Alert,
//   Snackbar,
//   CircularProgress,
// } from "@mui/material";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setLogin } from "../../state/index";
// import Dropzone from "react-dropzone";
// import FlexBetween from "../../components/FlexBetween";

// const registerSchema = yup.object().shape({
//   firstName: yup.string().required("First name is required"),
//   lastName: yup.string().required("Last name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string()
//     .min(5, "Password must be at least 5 characters")
//     .required("Password is required"),
//   location: yup.string().required("Location is required"),
//   occupation: yup.string().required("Occupation is required"),
//   picture: yup.mixed().test("fileRequired", "Profile picture is required", (value) => {
//     return value !== null && value !== undefined;
//   }),
// });

// const loginSchema = yup.object().shape({
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().required("Password is required"),
// });

// const initialValuesRegister = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   location: "",
//   occupation: "",
//   picture: null,
// };

// const initialValuesLogin = {
//   email: "",
//   password: "",
// };

// const Form = () => {
//   const [pageType, setPageType] = useState("login");
//   const [isLoading, setIsLoading] = useState(false);
//   const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
//   const { palette } = useTheme();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isNonMobile = useMediaQuery("(min-width:600px)");
//   const isLogin = pageType === "login";
//   const isRegister = pageType === "register";

//   const showAlert = (message, severity = "error") => {
//     setAlert({ open: true, message, severity });
//   };

//   const register = async (values, onSubmitProps) => {
//     setIsLoading(true);
//     console.log("Register values:", values);
    
//     try {
//       // Create FormData properly
//       const formData = new FormData();
      
//       // Append text fields
//       formData.append("firstName", values.firstName);
//       formData.append("lastName", values.lastName);
//       formData.append("email", values.email);
//       formData.append("password", values.password);
//       formData.append("location", values.location);
//       formData.append("occupation", values.occupation);
      
//       // Append file
//       if (values.picture) {
//         formData.append("picture", values.picture);
//       }
      
//       // Log FormData contents for debugging
//       for (let [key, value] of formData.entries()) {
//         console.log(`${key}:`, value);
//       }

//       const response = await fetch("https://echocircle-backend.vercel.app/auth/register", {
//         method: "POST",
//         body: formData,
//         // Don't set Content-Type header - let browser set it with boundary
//       });

//       console.log("Response status:", response.status);
//       const result = await response.json();
//       console.log("Response data:", result);
      
//       if (!response.ok) {
//         throw new Error(result.message || `Registration failed with status: ${response.status}`);
//       }

//       if (result.success) {
//         showAlert(result.message || "Registration successful! Please login.", "success");
//         onSubmitProps.resetForm();
//         setPageType("login");
//       } else {
//         throw new Error(result.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       showAlert(error.message || "Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (values, onSubmitProps) => {
//     setIsLoading(true);
//     try {
//       console.log("Login attempt for:", values.email);
      
//       const response = await fetch("https://echocircle-backend.vercel.app/auth/login", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });

//       console.log("Login response status:", response.status);
//       const result = await response.json();
//       console.log("Login response data:", result);
      
//       if (!response.ok) {
//         throw new Error(result.message || `Login failed: ${response.status}`);
//       }

//       if (result.token && result.user) {
//         dispatch(
//           setLogin({
//             user: result.user,
//             token: result.token,
//           })
//         );
//         showAlert("Login successful!", "success");
//         setTimeout(() => {
//           navigate("/home");
//         }, 1000);
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       showAlert(error.message || "Login failed. Please check your credentials.");
//     } finally {
//       setIsLoading(false);
//       onSubmitProps.resetForm();
//     }
//   };

//   const handleFormSubmit = async (values, onSubmitProps) => {
//     console.log("Form submitted, pageType:", pageType);
//     if (isLogin) {
//       await login(values, onSubmitProps);
//     } else if (isRegister) {
//       await register(values, onSubmitProps);
//     }
//   };

//   return (
//     <>
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={6000}
//         onClose={() => setAlert({ ...alert, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={() => setAlert({ ...alert, open: false })} 
//           severity={alert.severity}
//           sx={{ width: '100%' }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>

//       <Formik
//         onSubmit={handleFormSubmit}
//         initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
//         validationSchema={isLogin ? loginSchema : registerSchema}
//         validateOnBlur={true}
//         validateOnChange={true}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleBlur,
//           handleChange,
//           handleSubmit,
//           setFieldValue,
//           resetForm,
//           isValid,
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Box
//               display="grid"
//               gap="30px"
//               gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//               sx={{
//                 "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//               }}
//             >
//               {isRegister && (
//                 <>
//                   <TextField
//                     label="First Name"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     value={values.firstName}
//                     name="firstName"
//                     error={Boolean(touched.firstName) && Boolean(errors.firstName)}
//                     helperText={touched.firstName && errors.firstName}
//                     sx={{ gridColumn: "span 2" }}
//                     disabled={isLoading}
//                   />
//                   <TextField
//                     label="Last Name"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     value={values.lastName}
//                     name="lastName"
//                     error={Boolean(touched.lastName) && Boolean(errors.lastName)}
//                     helperText={touched.lastName && errors.lastName}
//                     sx={{ gridColumn: "span 2" }}
//                     disabled={isLoading}
//                   />
//                   <TextField
//                     label="Location"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     value={values.location}
//                     name="location"
//                     error={Boolean(touched.location) && Boolean(errors.location)}
//                     helperText={touched.location && errors.location}
//                     sx={{ gridColumn: "span 4" }}
//                     disabled={isLoading}
//                   />
//                   <TextField
//                     label="Occupation"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     value={values.occupation}
//                     name="occupation"
//                     error={Boolean(touched.occupation) && Boolean(errors.occupation)}
//                     helperText={touched.occupation && errors.occupation}
//                     sx={{ gridColumn: "span 4" }}
//                     disabled={isLoading}
//                   />
                  
//                   {/* Picture Upload Section */}
//                   <Box
//                     gridColumn="span 4"
//                     border={`1px solid ${
//                       errors.picture && touched.picture 
//                         ? palette.error.main 
//                         : palette.neutral.medium
//                     }`}
//                     borderRadius="5px"
//                     p="1rem"
//                   >
//                     <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                       Profile Picture *
//                     </Typography>
//                     <Dropzone
//                       accept={{
//                         'image/jpeg': ['.jpeg', '.jpg'],
//                         'image/png': ['.png']
//                       }}
//                       maxFiles={1}
//                       maxSize={5242880} // 5MB
//                       onDrop={(acceptedFiles) => {
//                         if (acceptedFiles.length > 0) {
//                           setFieldValue("picture", acceptedFiles[0]);
//                         }
//                       }}
//                       disabled={isLoading}
//                     >
//                       {({ getRootProps, getInputProps, isDragActive }) => (
//                         <Box
//                           {...getRootProps()}
//                           border={`2px dashed ${
//                             errors.picture && touched.picture 
//                               ? palette.error.main 
//                               : palette.primary.main
//                           }`}
//                           p="1.5rem"
//                           sx={{ 
//                             "&:hover": { 
//                               cursor: isLoading ? "not-allowed" : "pointer",
//                               backgroundColor: palette.neutral.light
//                             },
//                             backgroundColor: isDragActive ? palette.neutral.light : "transparent"
//                           }}
//                         >
//                           <input {...getInputProps()} />
//                           {!values.picture ? (
//                             <Box textAlign="center">
//                               <EditOutlinedIcon sx={{ color: palette.neutral.medium, mb: 1 }} />
//                               <Typography>
//                                 {isDragActive 
//                                   ? "Drop the image here..." 
//                                   : "Drag & drop a profile picture, or click to select"}
//                               </Typography>
//                               <Typography variant="caption" color="textSecondary">
//                                 Only *.jpeg, *.jpg, *.png images up to 5MB
//                               </Typography>
//                             </Box>
//                           ) : (
//                             <FlexBetween>
//                               <Box>
//                                 <Typography fontWeight="500">{values.picture.name}</Typography>
//                                 <Typography variant="caption" color="textSecondary">
//                                   {(values.picture.size / 1024 / 1024).toFixed(2)} MB
//                                 </Typography>
//                               </Box>
//                               <EditOutlinedIcon />
//                             </FlexBetween>
//                           )}
//                         </Box>
//                       )}
//                     </Dropzone>
//                     {errors.picture && touched.picture && (
//                       <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
//                         {errors.picture}
//                       </Typography>
//                     )}
//                   </Box>
//                 </>
//               )}

//               <TextField
//                 label="Email"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.email}
//                 name="email"
//                 type="email"
//                 error={Boolean(touched.email) && Boolean(errors.email)}
//                 helperText={touched.email && errors.email}
//                 sx={{ gridColumn: "span 4" }}
//                 disabled={isLoading}
//               />
//               <TextField
//                 label="Password"
//                 type="password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.password}
//                 name="password"
//                 error={Boolean(touched.password) && Boolean(errors.password)}
//                 helperText={touched.password && errors.password}
//                 sx={{ gridColumn: "span 4" }}
//                 disabled={isLoading}
//               />
//             </Box>

//             {/* BUTTONS */}
//             <Box mt="2rem">
//               <Button
//                 fullWidth
//                 type="submit"
//                 disabled={isLoading || (!isValid && isRegister)}
//                 variant="contained"
//                 sx={{
//                   p: "1rem",
//                   backgroundColor: palette.primary.main,
//                   color: "white",
//                   "&:hover": { 
//                     backgroundColor: palette.primary.dark,
//                   },
//                   "&:disabled": {
//                     backgroundColor: palette.neutral.medium,
//                   }
//                 }}
//               >
//                 {isLoading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : isLogin ? "LOGIN" : "REGISTER"}
//               </Button>
              
//               <Typography
//                 onClick={() => {
//                   if (!isLoading) {
//                     setPageType(isLogin ? "register" : "login");
//                     resetForm();
//                   }
//                 }}
//                 sx={{
//                   textDecoration: "underline",
//                   color: palette.primary.main,
//                   textAlign: "center",
//                   mt: 2,
//                   "&:hover": {
//                     cursor: isLoading ? "not-allowed" : "pointer",
//                     color: palette.primary.light,
//                   },
//                   opacity: isLoading ? 0.7 : 1,
//                 }}
//               >
//                 {isLogin
//                   ? "Don't have an account? Sign Up here."
//                   : "Already have an account? Login here."}
//               </Typography>
//             </Box>
//           </form>
//         )}
//       </Formik>
//     </>
//   );
// };

// export default Form;