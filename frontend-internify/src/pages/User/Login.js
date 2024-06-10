import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user/user-slice";
import { Box, Button, Grid, Typography, useMediaQuery, Backdrop, CircularProgress } from "@mui/material";
import img from "../../assets/login img.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { StyledField, Flexbox } from "../../misc/MUIComponent";
import axios from "axios";
import * as Yup from "yup";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
        setLoading(true); // Start loading
        console.log("Form Submitted", values);
        const csrfResponse = await axios.get(
          "http://127.0.0.1:8000/signin/get-csrf-token/",
          { withCredentials: true }
        );
        const csrfToken = csrfResponse.data.csrf_token;
        console.log(csrfToken);
        
        const loginResponse = await axios.post("http://127.0.0.1:8000/signin/", values, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            "csrftoken" : csrfToken
          },
          withCredentials: true,
        });
        console.log("login Response:", loginResponse);

        if (loginResponse.status === 200) {
          console.log("login Success");
          dispatch(userActions.login({ token: csrfToken, details: loginResponse.data.user_details }));
          console.log("value:", { token: csrfToken, details: loginResponse.data.user_details });
          const userType = loginResponse.data.user_details.user_type;  
          console.log("User Type:", userType);
          if (userType === 1) {
            navigate("/internships");
          } else if (userType === 2) {
            navigate("/employer");
          } else {
            console.error("Invalid user type");
          }
        } else {
          console.error("Login failed:", loginResponse.data.error);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    },
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Flexbox
      sx={{
        flexDirection: "column",
        minHeight: "100vh",
        padding: "2rem",
        marginBottom: 10,
        position: "relative", // Ensure the backdrop covers the whole screen
      }}>
      <Typography
        variant="h4"
        sx={{ marginTop: "2rem", marginBottom: "4rem", textAlign: "center" }}>
        Sign In to the world of Internships!
      </Typography>
      <Grid container spacing={2}>
        {!isMobile && (
          <Grid item xs={12} md={6} sx={{ marginTop: { xs: "2rem", md: 0 } }}>
            <img
              src={img}
              alt="Left Side Image"
              style={{ marginRight: -80, width: "100%", borderRadius: "8px" }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Box sx={{ marginLeft: 12, marginTop: 10, marginRight: isMobile ? 0 : "2rem" }}>
            <Typography
              variant="body1"
              sx={{ width: isMobile ? "100%" : "20rem", marginBottom: "1rem" }}>
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
                  error={formik.touched.username && Boolean(formik.errors.username)}
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
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  <Link to="/signup" sx={{ color: "#F53855" }}>
                    Forgot Password?
                  </Link>
                </Typography>
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
                  }}>
                  Log In
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Flexbox>
  );
};

export default LoginForm;
