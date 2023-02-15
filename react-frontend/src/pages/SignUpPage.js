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
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { registerWithEmailAndPassword, signInWithGoogle, logInWithEmailAndPassword, sendPasswordReset} from '../components/firebase';
import { setJWTToken } from '../helper/jwt';
import LoginButtonDisabled from '../components/LoginButtonDisabled'
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';

const theme = createTheme();

export default function SignUpPage({handleSetLoginPage, handleSetLogin}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPassword(e.target.value)
  }

  const handleSignUpFunction = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get('email');
    var password = data.get('password');
    var name = data.get('name');
    setLoading(true)
    try{
      const res = await registerWithEmailAndPassword(name,email, password);
      
      if (res) {
        handleSetLogin(true)
        const jwtToken = res.data['access_token']
        setJWTToken(jwtToken, rememberMe);
      }
    } catch (e) {
      console.log(e)  
    }
    setLoading(false)
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    setLoadingGoogle(true)
    try{
      const res = await signInWithGoogle()
      
      if (res) {
        handleSetLogin(true)
        const jwtToken = res.data['access_token']
        setJWTToken(jwtToken, rememberMe);
      }
    } catch (e) {
      console.log(e)
    }
    setLoadingGoogle(false)
  }

  return (
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
              Sign Up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSignUpFunction}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="name"
                    name="name"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                />
                <TextField
                    onChange={handlePasswordChange}
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
                    onChange={() => {setRememberMe(!rememberMe);}}
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                {!password ?
                <Alert severity="info">Password should be 6 characters long</Alert>:
                ""
                }
                {password && password.length < 6 ? 
                <Alert severity="error">Password should be 6 characters long</Alert>:
                ""}
                {password.length < 6 || loading ?
                  <LoadingButton
                      disabled
                      fullWidth
                      variant="contained"
                      loadingPosition='end'
                      endIcon={<LoginIcon />}
                      sx={{ mt: 3, mb: 2 }}
                  >
                      Sign Up
                  </LoadingButton>    
                :
                  <LoadingButton
                      type="submit"
                      loading={loading}
                      fullWidth
                      loadingPosition='end'
                      endIcon={<LoginIcon />}
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                  >
                      Sign Up
                  </LoadingButton>
                }

              <LoadingButton
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={loadingGoogle}
                loadingPosition='end'
                endIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
              >
                Sign In With Google
              </LoadingButton>
              <Grid container>
                <Grid item>
                  <Button onClick={handleSetLoginPage}>
                    Have an account already?
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
}