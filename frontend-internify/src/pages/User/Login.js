import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user/user-slice";
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import img from "../../assets/login img.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { StyledField, Flexbox } from "../../misc/MUIComponent";
import axios from "axios";
import * as Yup from "yup";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true); 
        console.log("Form Submitted", values);

        
        const loginResponse = await axios.post(
          "http://127.0.0.1:8000/signin/",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("login Response:", loginResponse);

        if (loginResponse.status === 200) {
          const { tokens, user_details } = loginResponse.data;
          console.log("login Success");

          // Save JWT tokens in localStorage
          localStorage.setItem("access_token", tokens.access);
          localStorage.setItem("refresh_token", tokens.refresh);

          // Dispatch login action
          dispatch(
            userActions.login({ token: tokens.access, details: user_details })
          );
          console.log("value:", {
            token: tokens.access,
            details: user_details,
          });

          // Navigate based on user type
          const userType = user_details?.user_type;
          if (userType === 1) {
            navigate("/internships");
          } else if (userType === 2) {
            navigate("/employer");
          } else {
            console.error("Invalid user type");
          }
        } else {
          console.error("Login failed:", loginResponse.data.error);
          setAlertMessage("ID or Password are incorrect.");
          setAlertOpen(true);
        }
      } catch (error) {
        console.error("API Error:", error);
        setAlertMessage("ID or Password are incorrect.");
        setAlertOpen(true);
      } finally {
        setLoading(false); 
      }
    },
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Flexbox
      sx={{
        flexDirection: "column",
        minHeight: "100vh",
        padding: "2rem",
        marginBottom: 10,
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginTop: "2rem", marginBottom: "3rem", textAlign: "center" }}
      >
        Sign In to the world of Internships!
      </Typography>
      <Grid container spacing={2}>
        {!isMobile && (
          <Grid item xs={12} md={6} sx={{ marginTop: { xs: "2rem", md: 0 } }}>
            <img
              src={img}
              alt="Left Side Image"
              style={{
                marginRight: -80,
                width: "100%",
                borderRadius: "8px",
                marginTop: 0,
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              marginLeft: 12,
              marginTop: 10,
              marginRight: isMobile ? 0 : "2rem",
            }}
          >
            <Typography
              variant="body1"
              sx={{ width: isMobile ? "100%" : "20rem", marginBottom: "1rem" }}
            >
              If you don't have an account registered You can{" "}
              <Link to="/signup" sx={{ color: "#F53855" }}>
                Signup here.
              </Link>
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit} style={{ marginLeft: 100 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledField
                  variant="standard"
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledField
                  variant="standard"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: isMobile ? "100%" : "25rem",
                    height: "2.5rem",
                    color: "white",
                    backgroundColor: "#F53855",
                    marginTop: 3,
                    borderRadius: 10,
                    textTransform: "none",
                  }}
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Flexbox>
  );
};

export default LoginForm;
