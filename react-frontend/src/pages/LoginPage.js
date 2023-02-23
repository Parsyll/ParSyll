import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignUpPage from './SignUpPage';
import {signInWithGoogle, logInWithEmailAndPassword, sendPasswordReset, firebaseErrorHandeling} from '../helper/firebase';
import { setJWTToken } from '../helper/jwt';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import ErrorMessage from '../components/ErrorMessage';
import { setPersistence } from 'firebase/auth';

const theme = createTheme();

export default function LoginPage({handleSetLogin, setProfilePic, setUserName}) {
  const [loginPage, setLoginPage] = useState(true);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailChange = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPassword(e.target.value)
  }

  const displayErrorMessage = (errorText) => {
    setErrorMessage(errorText)
      setTimeout(() => {
        setErrorMessage("")
      }, 3500)
  }

  const handleLogInFunction = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var email = data.get('email');
    var password = data.get('password');
    
    try{
      var res = await logInWithEmailAndPassword(email, password);
      if(res instanceof Error) {
        throw res;
      }

      if(res) {
        handleSetLogin(true)
        const jwtToken = res['access_token']
        const user = res.user
        console.log(user)
        setProfilePic(user["photoURL"])
        setUserName(user["displayName"])
        setJWTToken(jwtToken, rememberMe)
      }
    } catch (error) {
      const errorText = firebaseErrorHandeling(error)
      displayErrorMessage(errorText)
    }
    setLoading(false)
  };

  const handleSetLoginPage = () => {
    setLoginPage(true)
  }

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    setLoadingGoogle(true)
    try{
      var res = await signInWithGoogle()

      if(res instanceof Error) {
        throw res;
      }
      
      if (res) {
        handleSetLogin(true)
        console.log(res)
        const jwtToken = res['access_token']
        const user = res.user
        setProfilePic(user["photoURL"])
        setUserName(user["displayName"])

        setJWTToken(jwtToken, rememberMe)
      }
    } catch (error){
      console.log(error);
      const errorText = firebaseErrorHandeling(error)
      displayErrorMessage(errorText)
    }
    setLoadingGoogle(false)
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
                  onChange={handleEmailChange}
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
                  onChange={() => {setRememberMe(!rememberMe)}}
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />

                {(password && password.length < 6) && !loading? 
                  <Alert severity="error">Password should be 6 characters long</Alert>:
                ""}
                {errorMessage?
                <ErrorMessage text={errorMessage}/> : 
                ""
                }
                {(password.length < 6 || email.length < 5) ? 
                    <LoadingButton
                    disabled
                    fullWidth
                    variant="contained"
                    loadingPosition='end'
                    endIcon={<LoginIcon />}
                    sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </LoadingButton> 
                  :
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      fullWidth
                      loadingPosition="end"
                      endIcon={<LoginIcon />}
                      variant="contained"
                      sx={{ mt: 3, mb: 2}}
                    >
                      Log In
                    </LoadingButton>
              }
                
                <LoadingButton
                  loading={loadingGoogle}
                  fullWidth
                  loadingPosition="end"
                  endIcon={<GoogleIcon />}
                  variant="contained"
                  sx={{ mt: 3, mb: 2}}
                  onClick={handleGoogleSignIn}
                >
                  Log In With Google
                </LoadingButton>
                

                <Grid container>
                  <Grid item xs>
                    <Button onClick={handlePasswordChange}>
                      Forgot password?
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={(e) => {e.preventDefault(); setLoginPage(false)}}>
                      Don't have an account? Sign Up
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={handlePasswordChange}>
                      Reset Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      : 
      <SignUpPage handleSetLoginPage={handleSetLoginPage} handleSetLogin={handleSetLogin} setProfilePic={setProfilePic} setUserName={setUserName}/>
    }
    </ThemeProvider> 
  );
}