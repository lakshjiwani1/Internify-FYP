import React from 'react';
import { AppBar, Divider, IconButton, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../assets/logo-no-background.png";
import { NavItem } from "../misc/MUIComponent";

const EmployerNavigationbar = () => {
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
        </Toolbar>
      </AppBar>
      <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.12)' }} />
    </>
  );
};

export default EmployerNavigationbar;
