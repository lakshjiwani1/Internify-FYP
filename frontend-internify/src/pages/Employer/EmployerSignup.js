import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Container,
  Grid,
  MenuItem,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { EStyledField, Flexbox } from "../../misc/MUIComponent";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupForm = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password1: "",
      password2: "",  
      contact_number: "",  
      tax_id: "",  
      address: "",
      industry_type: "",  
      website_url: "",  
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/register/company",
          values
        );
        console.log("Signup Response: ", response.data);

        if (response.status === 200 || response.status === 201) {
          console.log("Form Submitted Successfully:", response.data);
          navigate("/login");
        } else {
          console.error("Signup failed:", response.data.error);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string().required("Required"),
      password1: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      password2: Yup.string()
        .oneOf([Yup.ref("password1"), null], "Passwords must match")
        .required("Required"),
      contact_number: Yup.string().required("Required"),  // Updated
      tax_id: Yup.string().required("Required"),  // Updated
      address: Yup.string().required("Required"),
      industry_type: Yup.string().required("Required"),  // Updated
      website_url: Yup.string().url("Invalid URL").required("Required"),  // Updated
      description: Yup.string(),
    }),
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Flexbox
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
      }}
    >
      <Container component="main" maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            borderRadius: "15px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "2rem", textAlign: "center" }}
          >
            Welcome to Internify Employer!
          </Typography>
          <Box>
            <Typography
              variant="body1"
              sx={{ marginLeft: isMobile ? "0" : "9rem", marginBottom: "1rem", textAlign: isMobile ? "center" : "left" }}
            >
              If you already have an account registered You can{" "}
              <Link to="/login" sx={{ color: "#F53855" }}>
                Login here.
              </Link>
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit} style={{ marginLeft: isMobile ? "0" : "9rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Name
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Email
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Username
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Password
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="password1"
                  name="password1"
                  type="password"
                  value={formik.values.password1}
                  onChange={formik.handleChange}
                  error={formik.touched.password1 && Boolean(formik.errors.password1)}
                  helperText={formik.touched.password1 && formik.errors.password1}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Confirm Password
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="password2"
                  name="password2"
                  type="password"
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  error={formik.touched.password2 && Boolean(formik.errors.password2)}
                  helperText={formik.touched.password2 && formik.errors.password2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Contact Number
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="contact_number"
                  name="contact_number"
                  value={formik.values.contact_number}
                  onChange={formik.handleChange}
                  error={formik.touched.contact_number && Boolean(formik.errors.contact_number)}
                  helperText={formik.touched.contact_number && formik.errors.contact_number}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Tax ID
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="tax_id"
                  name="tax_id"
                  value={formik.values.tax_id}
                  onChange={formik.handleChange}
                  error={formik.touched.tax_id && Boolean(formik.errors.tax_id)}
                  helperText={formik.touched.tax_id && formik.errors.tax_id}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Address
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Industry Type
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="industry_type"
                  name="industry_type"
                  select
                  value={formik.values.industry_type}
                  onChange={formik.handleChange}
                  error={formik.touched.industry_type && Boolean(formik.errors.industry_type)}
                  helperText={formik.touched.industry_type && formik.errors.industry_type}
                  fullWidth
                >
                  <MenuItem value="Accounting">Accounting</MenuItem>
                  <MenuItem value="Administration & Office Support">Administration & Office Support</MenuItem>
                  <MenuItem value="Advertising, Arts & Media">Advertising, Arts & Media</MenuItem>
                  <MenuItem value="Banking & Financial Services">Banking & Financial Services</MenuItem>
                  <MenuItem value="Healthcare & Medical">Healthcare & Medical</MenuItem>
                </EStyledField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Website
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="website_url"
                  name="website_url"
                  value={formik.values.website_url}
                  onChange={formik.handleChange}
                  error={formik.touched.website_url && Boolean(formik.errors.website_url)}
                  helperText={formik.touched.website_url && formik.errors.website_url}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
                  Description
                </Typography>
                <EStyledField
                  variant="outlined"
                  id="description"
                  name="description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "60%",
                height: "2.5rem",
                color: "white",
                backgroundColor: "#F53855",
                marginTop: 5,
                borderRadius: 10,
                textTransform: "none",
                marginLeft: "4rem",
              }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </Flexbox>
  );
};

export default SignupForm;
