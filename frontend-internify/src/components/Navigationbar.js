import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserState, userActions } from "../store/user/user-slice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo-no-background.png";
import { NavItem } from "../misc/MUIComponent";
import axios from "axios";

function Navigationbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userState = useSelector(selectUserState);
  const userId = userState?.details?.user_id;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    localStorage.removeItem('persist:root');
    window.location = '/login';
    console.log("Logout successful.");
  };

  const navigationLinks = [
    { text: "Home", to: "/" },
    { text: "Internships", to: "/internships" },
    { text: "Resume Builder", to: "/resume" },
    { text: "Articles", to: "/articles" },
    { text: "Companies", to: "/companies" },
  ];

  const drawerContent = (
    <List>
      {navigationLinks.map((link, index) => (
        <ListItem key={index} component={NavItem} to={link.to}>
          <ListItemText primary={link.text} />
        </ListItem>
      ))}
      <Divider />
      {userId && (
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Log Out" />
        </ListItem>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Hidden mdUp>
            {/* Menu icon for mobile screens */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 1 }}>
              <MenuIcon />
            </IconButton>
          </Hidden>

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

          <Hidden smDown>
            {/* Navigation links for tablet and desktop screens */}
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-end",
                gap: "40px",
              }}>
              {navigationLinks.map((link, index) => (
                <NavItem
                  key={index}
                  to={link.to}
                  isActive={location.pathname === link.to}>
                  {link.text}
                </NavItem>
              ))}
            </Typography>
          </Hidden>

          <Hidden mdUp>
            {/* Drawer for mobile screens */}
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}>
              {drawerContent}
            </Drawer>
          </Hidden>

          <Hidden smDown>
            {userId ? (
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
            ) : (
              // Log In and Sign Up buttons for tablet and desktop screens if not authenticated
              <>
                <Button
                  color="inherit"
                  component={NavItem}
                  to="/login"
                  sx={{
                    marginRight: 3,
                    marginLeft: 5,
                    fontWeight: 500,
                    borderRadius: 10,
                    textTransform: "none",
                    fontSize: "1.2rem",
                    color: "#4F5665",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}>
                  Log In
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={NavItem}
                  to="/signup"
                  sx={{
                    width: "7rem",
                    marginRight: 2,
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
                  Sign Up
                </Button>
              </>
            )}
          </Hidden>
        </Toolbar>
      </AppBar>
      <Divider sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
    </>
  );
}

export default Navigationbar;
