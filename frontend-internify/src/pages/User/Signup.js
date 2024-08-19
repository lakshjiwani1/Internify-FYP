import React from "react";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import img from "../../assets/signup img.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { StyledField, Flexbox } from "../../misc/MUIComponent";
import axios from "axios";

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password1: "",
      password2: "",
      user_type: "1",
    },
    onSubmit: async (values) => {
      console.log(formik.username)
      console.log(formik.password1);
      console.log(formik.password2);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/signup/",
          values, {
            headers: {
              'Content-Type' : 'application/json'
            }
          }
        );
        console.log("Signup Response:", response.data);

        if (response.status === 201) {
          console.log("Signup successful");
          navigate("/login");
        } else {
          console.error("Signup failed:", response.data.error);
          console.log("status: ", response.status);
          console.log("values: ", values);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Required"),
      last_name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string().required("Required"),
      password1: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      password2: Yup.string()
        .oneOf([Yup.ref("password1"), null], "Passwords must match")
        .required("Required"),
    }),
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Flexbox
      sx={{
        flexDirection: "column",
        minHeight: "100vh",
        padding: "2rem",
        marginLeft: isMobile ? "0rem" : "6rem",
        marginBottom: 10,
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginTop: "2rem", marginBottom: "6rem", textAlign: "center" }}
      >
        Sign Up now to Kickstart your career!
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <input type="hidden" name="user_type" value={formik.values.user_type} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  width: isMobile ? "100%" : "20rem",
                  marginBottom: "1rem", 
                }}
              >
                If you already have an account registered You can{" "}
                <Link to="/login" sx={{ color: "#F53855" }}>
                  Log In here.
                </Link>
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledField
                  variant="standard"
                  id="first_name"
                  name="first_name"
                  label="First Name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <StyledField
                  variant="standard"
                  id="last_name"
                  name="last_name"
                  label="Last Name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.last_name && Boolean(formik.errors.last_name)
                  }
                  helperText={
                    formik.touched.last_name && formik.errors.last_name
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <StyledField
                  variant="standard"
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
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
                  id="password1"
                  name="password1"
                  label="Password"
                  type="password"
                  value={formik.values.password1}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password1 && Boolean(formik.errors.password1)
                  }
                  helperText={
                    formik.touched.password1 && formik.errors.password1
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <StyledField
                  variant="standard"
                  id="password2"
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password2 && Boolean(formik.errors.password2)
                  }
                  helperText={
                    formik.touched.password2 && formik.errors.password2
                  }
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
                    marginTop: 5,
                    borderRadius: 10,
                    textTransform: "none",
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {!isMobile && (
            <Grid item xs={12} md={6} sx={{ marginTop: { xs: "2rem", md: 0 } }}>
              <img
                src={img}
                alt="Left Side Image"
                style={{
                  marginLeft: -80,
                  marginTop: 80,
                  width: "110%",
                  borderRadius: "8px",
                }}
              />
            </Grid>
          )}
        </Grid>
      </form>
    </Flexbox>
  );
};

export default SignupForm;
