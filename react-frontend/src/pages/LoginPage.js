import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignUpPage from './SignUpPage';
import {signInWithGoogle, logInWithEmailAndPassword, sendPasswordReset } from '../components/firebase';

const theme = createTheme();

export default function LoginPage({handleSetLogin}) {
  const [loginPage, setLoginPage] = useState(true);

  const handleLogInFunction = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // registerWithEmailAndPassword();
    var email = data.get('email');
    var password = data.get('password');
    var res = await logInWithEmailAndPassword(email, password);
    console.log(res)
    if(res) {
        handleSetLogin(true)
    }
  };

  const handleSetLoginPage = () => {
    setLoginPage(true)
  }

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    var res = await signInWithGoogle()
    if (res) {
        handleSetLogin(true)
    }
  }  

  return (
    <ThemeProvider theme={theme}>
    {loginPage?
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/random)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log In
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogInFunction}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleGoogleSignIn}
                >
                  Log In With Google
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Button>
                      Forgot password?
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={(e) => {e.preventDefault(); setLoginPage(false)}}>
                      Don't have an account? Sign Up
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button>
                      Reset Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      : 
      <SignUpPage handleSetLoginPage={handleSetLoginPage} handleSetLogin={handleSetLogin}/>
    }
    </ThemeProvider> 
  );
}