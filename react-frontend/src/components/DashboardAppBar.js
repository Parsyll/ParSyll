import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Navigate, Link } from 'react-router-dom';
import { removeJWTToken } from '../helper/jwt';
import ContentCutIcon from '@mui/icons-material/ContentCut';

export default function DashboardAppBar({loggedIn, handleSetLogin, profilePic}) {

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
              component={Link} to="/courses"
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
              <ContentCutIcon />
            </IconButton> 
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Parsyll
          </Typography>
          {loggedIn ?
          <Box sx={{display:'flex'}}>
            <Button color="inherit" sx={{mr:1}}
              component={Link} to="/"> 
              Parse PDF 
            </Button>
            <Avatar alt="User" imgProps={{ referrerPolicy: "no-referrer" }} src={profilePic} 
            component={Link} to="/profile"/>
          </Box>
          :
          <Box>
            <Button color="inherit"> Login </Button>
          </Box>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}