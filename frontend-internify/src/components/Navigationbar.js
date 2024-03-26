import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Button, Divider, Drawer, Hidden, IconButton, Toolbar, Typography, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../assets/logo-no-background.png";
import { NavItem } from "../misc/MUIComponent";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { useAuth } from './Authentication';

function Navigationbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated ,setIsAuthenticated } = useAuth();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
        await axios.get('http://127.0.0.1:8000/signout/');
        setIsAuthenticated(false);
        console.log('isAuthenticated', isAuthenticated);
        navigate('/login'); 
        console.log('Logout successful.');
    } catch (error) {
        console.error('Logout Error:', error);
    }
};

  const navigationLinks = [
    { text: 'Home', to: '/' },
    { text: 'Internships', to: '/internships' },
    { text: 'Resume Builder', to: '/resume' },
    { text: 'Articles', to: '/articles' },
    { text: 'Companies', to: '/companies' },
  ];

  const authLinks = [
    { text: 'Settings', to: '/settings' },
    { text: 'My Applications', to: '/applications' },
    { text: 'Log Out', onClick: handleLogout }, 
  ];

  const drawerContent = (
    <List>
      {navigationLinks.map((link, index) => (
        <ListItem key={index} component={NavItem} to={link.to}>
          <ListItemText primary={link.text} />
        </ListItem>
      ))}
      <Divider />
      {authLinks.map((link, index) => (
        <ListItem key={index} component={NavItem} to={link.to}>
          <ListItemText primary={link.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position='static' color='transparent'  >
        <Toolbar>
          <Hidden mdUp>
            {/* Menu icon for mobile screens */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ marginRight: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>

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

          <Hidden smDown>
            {/* Navigation links for tablet and desktop screens */}
            <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: '40px' }}>
              {navigationLinks.map((link, index) => (
                <NavItem key={index} to={link.to} isActive={location.pathname === link.to}>
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
              }}
            >
              {drawerContent}
            </Drawer>
          </Hidden>

          <Hidden smDown>
            {isAuthenticated ? (
              // User dropdown menu for tablet and desktop screens if authenticated
              <>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                  sx={{marginLeft: 5}}
                >
                  <AccountCircleIcon fontSize='large' />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {authLinks.map((link, index) => (
                    <MenuItem key={index} component={NavItem} to={link.to} onClick={handleMenuClose}>
                      {link.text}
                    </MenuItem>
                  ))}
                </Menu>
              </>
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
                    textTransform: 'none',
                    fontSize: "1.2rem",
                    color: "#4F5665",
                    '&:hover': {
                      backgroundColor: "white",
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant='outlined'
                  color="inherit"
                  component={NavItem}
                  to="/signup"
                  sx={{
                    width: "7rem",
                    marginRight: 2,
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
                  Sign Up
                </Button>
              </>
            )}
          </Hidden>
        </Toolbar>
      </AppBar>
      <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.12)' }} />
    </>
  );
}

export default Navigationbar;
