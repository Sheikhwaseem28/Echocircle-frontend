import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup
    .mixed()
    .test(
      "fileRequired",
      "Profile picture is required",
      (value) => value !== null && value !== undefined
    ),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
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
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const showAlert = (message, severity = "error") => {
    setAlert({ open: true, message, severity });
  };

  const register = async (values, onSubmitProps) => {
    setIsLoading(true);
    console.log("Register values:", values);

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

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(
        "https://echocircle-backend.vercel.app/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Registration failed with status: ${response.status}`
        );
      }

      if (result.success) {
        showAlert(
          result.message || "Registration successful! Please login.",
          "success"
        );
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
      console.log("Login attempt for:", values.email);

      const response = await fetch(
        "https://echocircle-backend.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      console.log("Login response status:", response.status);
      const result = await response.json();
      console.log("Login response data:", result);

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
      showAlert(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
      onSubmitProps.resetForm();
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log("Form submitted, pageType:", pageType);
    if (isLogin) {
      await login(values, onSubmitProps);
    } else if (isRegister) {
      await register(values, onSubmitProps);
    }
  };

  return (
    <>
      {/* Snackbar for messages (kept same behavior) */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

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
            {/* Grid wrapper */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isRegister && (
                <>
                  {/* First Name */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="firstName"
                      className="text-xs font-medium uppercase tracking-wide text-neutral-300"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      disabled={isLoading}
                      className={`w-full rounded-lg border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 ${
                        touched.firstName && errors.firstName
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Enter your first name"
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="text-xs text-red-400">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-medium uppercase tracking-wide text-neutral-300"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      disabled={isLoading}
                      className={`w-full rounded-lg border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 ${
                        touched.lastName && errors.lastName
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Enter your last name"
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="text-xs text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label
                      htmlFor="location"
                      className="text-xs font-medium uppercase tracking-wide text-neutral-300"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.location}
                      disabled={isLoading}
                      className={`w-full rounded-lg border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 ${
                        touched.location && errors.location
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Where are you based?"
                    />
                    {touched.location && errors.location && (
                      <p className="text-xs text-red-400">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Occupation */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label
                      htmlFor="occupation"
                      className="text-xs font-medium uppercase tracking-wide text-neutral-300"
                    >
                      Occupation
                    </label>
                    <input
                      id="occupation"
                      name="occupation"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.occupation}
                      disabled={isLoading}
                      className={`w-full rounded-lg border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 ${
                        touched.occupation && errors.occupation
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="What do you do?"
                    />
                    {touched.occupation && errors.occupation && (
                      <p className="text-xs text-red-400">
                        {errors.occupation}
                      </p>
                    )}
                  </div>

                  {/* Picture Upload */}
                  <div className="sm:col-span-2">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-300">
                      Profile Picture <span className="text-red-500">*</span>
                    </p>
                    <Dropzone
                      accept={{
                        "image/jpeg": [".jpeg", ".jpg"],
                        "image/png": [".png"],
                      }}
                      maxFiles={1}
                      maxSize={5242880}
                      onDrop={(acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                          setFieldValue("picture", acceptedFiles[0]);
                        }
                      }}
                      disabled={isLoading}
                    >
                      {({
                        getRootProps,
                        getInputProps,
                        isDragActive,
                        isDragReject,
                      }) => (
                        <div
                          {...getRootProps()}
                          className={`flex cursor-pointer flex-col rounded-xl border-2 border-dashed bg-black/40 px-4 py-5 text-center text-sm transition ${
                            touched.picture && errors.picture
                              ? "border-red-500"
                              : "border-red-700/60"
                          } ${
                            isDragActive
                              ? "border-red-500 bg-red-950/40"
                              : "hover:border-red-500 hover:bg-red-950/20"
                          } ${
                            isDragReject ? "border-red-600 bg-red-950/40" : ""
                          }`}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <div className="flex flex-col items-center gap-2">
                              <EditOutlinedIcon className="text-neutral-400" />
                              <p className="text-xs text-neutral-300">
                                {isDragActive
                                  ? "Drop the image here..."
                                  : "Drag & drop a profile picture, or click to select"}
                              </p>
                              <p className="text-[11px] text-neutral-500">
                                JPEG or PNG, up to 5MB
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3 text-left">
                              <div>
                                <p className="text-sm font-medium text-neutral-100">
                                  {values.picture.name}
                                </p>
                                <p className="text-[11px] text-neutral-500">
                                  {(values.picture.size / 1024 / 1024).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </p>
                              </div>
                              <EditOutlinedIcon className="text-neutral-400" />
                            </div>
                          )}
                        </div>
                      )}
                    </Dropzone>
                    {touched.picture && errors.picture && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.picture}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wide text-neutral-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  disabled={isLoading}
                  className={`w-full rounded-lg border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wide text-neutral-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  disabled={isLoading}
                  className={`w-full rounded-lg border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Enter your password"
                />
                {touched.password && errors.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Submit + Toggle */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || (!isValid && isRegister)}
                className="flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-900/70 disabled:text-neutral-400"
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isLoading) {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                  }
                }}
                className="w-full text-center text-xs text-red-400 underline underline-offset-4 transition hover:text-red-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLogin
                  ? "Don't have an account? Sign up here."
                  : "Already have an account? Login here."}
              </button>
            </div>
          </form>
        )}
      </Formik>
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