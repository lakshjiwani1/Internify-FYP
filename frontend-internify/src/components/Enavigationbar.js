import React, { useState } from 'react';
import { AppBar, Divider, IconButton, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../assets/logo-no-background.png";
import { NavItem } from "../misc/MUIComponent";
import { useLocation, useNavigate } from 'react-router-dom';

const EmployerNavigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout operations here
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to home page after logout
  };

  // Navigation links when user is authenticated
  const authenticatedNavigationLinks = [
    { text: 'Home', to: '/employer' },
    { text: 'Internships', to: '/pinternships' },
    { text: 'Settings', to: '/settings' },

  ];

  return (
    <>
      <AppBar position='static' color='transparent'>
        <Toolbar>
          <NavItem to="/">
            <IconButton
              edge="start"
              color="inherit"
              aria-label='menu'
              sx={{ flexGrow: 1, textAlign: 'center', "&:hover": { backgroundColor: 'transparent' } }}
            >
              <img src={logo} alt='Logo' style={{ width: "8rem", marginLeft: 10 }} />
            </IconButton>
          </NavItem>
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            Employer
          </Typography>

          {isAuthenticated ? (
            // Display navigation links when authenticated
            <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: '40px' }}>
              {authenticatedNavigationLinks.map((link, index) => (
                <NavItem key={index} to={link.to} isActive={location.pathname === link.to}>
                  {link.text}
                </NavItem>
              ))}
            </Typography>
          ) : (
            // Display Log In button when not authenticated
            <Button
              variant='outlined'
              color="inherit"
              component={NavItem}
              to="/elogin"
              sx={{
                width: "7rem",
                marginRight: 2,
                marginLeft: 'auto',
                color: "white",
                backgroundColor: "#F53855",
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: "white",
                  color: "#F53855",
                },
              }}
            >
              Log In
            </Button>
          )}

          {isAuthenticated && (
            // Display Log Out button when authenticated
            <Button
              variant='outlined'
              color="inherit"
              onClick={handleLogout}
              sx={{
                width: "7rem",
                marginRight: 2,
                marginLeft: 5,
                color: "#F53855",
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: "#F53855",
                  color: "white",
                },
              }}
            >
              Log Out
            </Button>
          )}

        </Toolbar>
      </AppBar>
      <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.12)' }} />
    </>
  );
};

export default EmployerNavigationbar;
