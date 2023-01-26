import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';

export default function DashboardAppBar({setView, loggedIn, handleSetLogin}) {

  const handlePdfParseButton = (e) => {
    e.preventDefault();
    setView(1);
  }
  
  const handleLoginButton = (e) => {
    e.preventDefault();
    setView(2);
  }
  
  const handleCourseMenuButton = (e) => {
    e.preventDefault();
    setView(0);
  }

  const handleLogOutLogic = (e) => {
    e.preventDefault();
    setView(2);
    handleSetLogin(false);
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {loggedIn? 
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={loggedIn? handleCourseMenuButton : handleLoginButton}
            >
              <MenuIcon />
            </IconButton> :

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              disabled
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> 
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Parsyll
          </Typography>
          {loggedIn ?
          <Box sx={{display:'flex'}}>
            <Button color="inherit" onClick={handlePdfParseButton}> Parse PDF </Button>
            <Button color="inherit" onClick={handleLogOutLogic}> Log Out </Button>
          </Box>:
          <Box>
            <Button color="inherit" onClick={handleLoginButton}> Login </Button>
          </Box>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}