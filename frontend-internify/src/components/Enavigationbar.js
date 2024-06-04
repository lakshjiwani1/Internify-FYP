import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserState, userActions } from "../store/user/user-slice";
import { AppBar, Divider, IconButton, Toolbar, Typography, Button } from "@mui/material";
import logo from "../assets/logo-no-background.png";
import { NavItem } from "../misc/MUIComponent";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployerNavigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
// const userId = useSelector(selectUserState.details.user_id);
const userState = useSelector(selectUserState);
const userId = userState?.details?.user_id;

// Function to handle logout
const handleLogout = async () => {
  // try {
    // await axios.get("http://127.0.0.1:8000/signout/");
    // dispatch(userActions.logout());
    localStorage.removeItem('persist:root');
    window.location = '/login';
    // navigate("/login");
    console.log("Logout successful.");
  // } catch (error) {
  //   console.error("Logout Error:", error);
  }

  // Navigation links when user is authenticated
  const authenticatedNavigationLinks = [
    { text: "Home", to: "/employer" },
    { text: "Internships", to: "/pinternships" },
    { text: "Settings", to: "/settings" },
  ];

  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <NavItem to="/">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                "&:hover": { backgroundColor: "transparent" },
              }}>
              <img src={logo} alt="Logo" style={{ width: "8rem", marginLeft: 10 }} />
            </IconButton>
          </NavItem>
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            Employer
          </Typography>

          {userId ? (
            // Display navigation links when authenticated
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-end",
                gap: "40px",
              }}>
              {authenticatedNavigationLinks.map((link, index) => (
                <NavItem
                  key={index}
                  to={link.to}
                  isActive={location.pathname === link.to}>
                  {link.text}
                </NavItem>
              ))}
            </Typography>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              component={NavItem}
              to="/login"
              sx={{
                width: "7rem",
                marginRight: 2,
                marginLeft: "auto",
                color: "white",
                backgroundColor: "#F53855",
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#F53855",
                },
              }}>
              Log In
            </Button>
          )}

          {userId && (
            // Display Log Out button when authenticated
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                width: "7rem",
                marginRight: 2,
                marginLeft: 5,
                color: "#F53855",
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#F53855",
                  color: "white",
                },
              }}>
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
    </>
  );
};

export default EmployerNavigationbar;
