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
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.mixed().required("Profile picture is required"),
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
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const showAlert = (message, severity = "error") => {
    setAlert({ open: true, message, severity });
  };

  const register = async (values, onSubmitProps) => {
    setIsLoading(true);
    const formData = new FormData();
    
    // Append all form fields
    for (const key in values) {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    }

    try {
      const response = await fetch("https://echocircle-backend.vercel.app/auth/register", {
        method: "POST",
        body: formData,
        // Let browser set the content-type with boundary
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Registration failed: ${response.status}`);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Login failed: ${response.status}`);
      }

      if (result.token) {
        dispatch(
          setLogin({
            user: result.user,
            token: result.token,
          })
        );
        showAlert("Login successful!", "success");
        navigate("/home");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert(error.message || "Login failed. Please try again.");
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
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlert({ ...alert, open: false })} 
          severity={alert.severity}
          sx={{ width: '100%' }}
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
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={Boolean(touched.location) && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                    disabled={isLoading}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${
                      errors.picture && touched.picture 
                        ? palette.error.main 
                        : palette.neutral.medium
                    }`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      accept={{
                        'image/*': ['.jpeg', '.jpg', '.png']
                      }}
                      maxFiles={1}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                      }}
                      disabled={isLoading}
                    >
                      {({ getRootProps, getInputProps, isDragActive }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${
                            errors.picture && touched.picture 
                              ? palette.error.main 
                              : palette.primary.main
                          }`}
                          p="2rem"
                          sx={{ 
                            "&:hover": { 
                              cursor: isLoading ? "not-allowed" : "pointer",
                              backgroundColor: palette.neutral.light
                            },
                            backgroundColor: isDragActive ? palette.neutral.light : "transparent"
                          }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <Typography textAlign="center">
                              {isDragActive 
                                ? "Drop the image here..." 
                                : "Drag & drop a profile picture, or click to select"}
                            </Typography>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                    {errors.picture && touched.picture && (
                      <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {errors.picture}
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                type="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
                disabled={isLoading}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
                disabled={isLoading}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                disabled={isLoading || !isValid}
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { 
                    backgroundColor: palette.primary.dark,
                    color: palette.background.alt,
                  },
                  "&:disabled": {
                    backgroundColor: palette.neutral.medium,
                    color: palette.neutral.dark,
                  }
                }}
              >
                {isLoading ? "PROCESSING..." : isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  if (!isLoading) {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                  }
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: isLoading ? "not-allowed" : "pointer",
                    color: palette.primary.light,
                  },
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Form;