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
import { Eye, EyeOff, Mail, Lock, User, MapPin, Briefcase, Upload } from "lucide-react";
import { API_URL } from "../../api";

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

const Form = ({ onModeChange }) => {
  const [pageType, setPageType] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showPassword, setShowPassword] = useState(false);

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

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

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
        onModeChange(true);
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
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

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

  const toggleMode = () => {
    const newMode = isLogin ? "register" : "login";
    setPageType(newMode);
    onModeChange(newMode === "login");
  };

  return (
    <>
      {/* Snackbar for messages */}
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Grid */}
            <div className="space-y-6">
              {isRegister && (
                <>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input
                          name="firstName"
                          type="text"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          disabled={isLoading}
                          className={`w-full rounded-lg border border-gray-700 bg-gray-900/30 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-rose-400/50 focus:outline-none focus:ring-1 focus:ring-rose-400/30 ${touched.firstName && errors.firstName
                            ? "border-red-400"
                            : ""
                            }`}
                          placeholder="John"
                        />
                      </div>
                      {touched.firstName && errors.firstName && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input
                          name="lastName"
                          type="text"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          disabled={isLoading}
                          className={`w-full rounded-lg border border-gray-700 bg-gray-900/30 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-rose-400/50 focus:outline-none focus:ring-1 focus:ring-rose-400/30 ${touched.lastName && errors.lastName
                            ? "border-red-400"
                            : ""
                            }`}
                          placeholder="Doe"
                        />
                      </div>
                      {touched.lastName && errors.lastName && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location & Occupation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input
                          name="location"
                          type="text"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.location}
                          disabled={isLoading}
                          className={`w-full rounded-lg border border-gray-700 bg-gray-900/30 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-rose-400/50 focus:outline-none focus:ring-1 focus:ring-rose-400/30 ${touched.location && errors.location
                            ? "border-red-400"
                            : ""
                            }`}
                          placeholder="City"
                        />
                      </div>
                      {touched.location && errors.location && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Occupation
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input
                          name="occupation"
                          type="text"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.occupation}
                          disabled={isLoading}
                          className={`w-full rounded-lg border border-gray-700 bg-gray-900/30 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-rose-400/50 focus:outline-none focus:ring-1 focus:ring-rose-400/30 ${touched.occupation && errors.occupation
                            ? "border-red-400"
                            : ""
                            }`}
                          placeholder="Role"
                        />
                      </div>
                      {touched.occupation && errors.occupation && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.occupation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Profile Photo
                    </label>
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
                          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all ${touched.picture && errors.picture
                            ? "border-red-400/50"
                            : "border-gray-700"
                            } ${isDragActive
                              ? "border-rose-400 bg-rose-900/10"
                              : "hover:border-gray-600"
                            } ${isDragReject
                              ? "border-red-400 bg-red-900/10"
                              : ""
                            }`}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <div className="space-y-3">
                              <div className="flex justify-center">
                                <Upload className="h-8 w-8 text-gray-500" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-300">
                                  {isDragActive
                                    ? "Drop your photo here"
                                    : "Upload profile photo"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  JPG or PNG, up to 5MB
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center">
                                  <EditOutlinedIcon className="text-rose-400" />
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-medium text-gray-100">
                                    {values.picture.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Click to change
                                  </p>
                                </div>
                              </div>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    name="email"
                    type="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    disabled={isLoading}
                    className={`w-full rounded-lg border border-gray-700 bg-gray-900/30 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-rose-400/50 focus:outline-none focus:ring-1 focus:ring-rose-400/30 ${touched.email && errors.email ? "border-red-400" : ""
                      }`}
                    placeholder="name@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    disabled={isLoading}
                    className={`w-full rounded-lg border border-gray-700 bg-gray-900/30 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-rose-400/50 focus:outline-none focus:ring-1 focus:ring-rose-400/30 ${touched.password && errors.password
                      ? "border-red-400"
                      : ""
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 bg-gray-900/30 text-rose-400 focus:ring-rose-400/30"
                    />
                    <span className="text-sm text-gray-400">
                      Remember this device
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-rose-400 hover:text-rose-300"
                  >
                    Need help?
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || (!isValid && isRegister)}
                className="w-full rounded-lg bg-gradient-to-r from-rose-500 to-red-600 py-4 font-medium text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <CircularProgress size={20} color="inherit" />
                    <span>Please wait...</span>
                  </div>
                ) : isLogin ? (
                  "Continue to EchoCircle"
                ) : (
                  "Create your account"
                )}
              </button>

              {isLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("email", "demo@gmail.com");
                    setFieldValue("password", "123456");
                    // We need to wait a tick for values to update before submitting, 
                    // or we can just call login directly with these values if we want to bypass validation check latency
                    // But using handleSubmit is safer for formik state.
                    // However, setFieldValue is async-ish in terms of re-render. 
                    // A better UX might be just filling it. 
                    // Let's just fill it for now as requested "button with credentials".
                    // The user can then click continue, or we can auto-submit. 
                    // Requirement: "add a demo login button... with credentials". 
                    // Usually implies auto-login or auto-fill. Let's auto-fill and show a snackbar or just auto-fill.
                    // Actually, let's try to submit for better UX.
                    setTimeout(() => handleSubmit(), 0);
                  }}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900/50 py-4 font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white disabled:opacity-50"
                >
                  Demo Login
                </button>
              )}
            </div>

            {/* Mode Toggle */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {isLogin ? "New here?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-rose-400 hover:text-rose-300"
                  disabled={isLoading}
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Form;