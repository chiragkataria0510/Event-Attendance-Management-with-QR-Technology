import React, { useContext, useEffect} from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { DataStore } from '../../utils/DataStore';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Link from 'next/link'
const theme = createTheme();

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(DataStore);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/admin');
    }
  }, [userInfo,router]);

  const submitHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      router.push(redirect || '/admin');
    } catch (err) {
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: 'error' }
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>

      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid container justifyContent='center' alignItems='center' item xs={false} sm={6} lg={6}>
        <Image src={process.env.LOGO_URL} width={900} height={500}  alt="Logo" />
        </Grid>
        <Grid item xs={12} sm={6} lg={6} component={Paper} elevation={6} square>
          {/* Form Started */}
          <form onSubmit={handleSubmit(submitHandler)} >
            <Box
              sx={{
                my: 8,
                mx: 4,
              }}
            >
                
              <Typography component="p" sx={{ fontWeight: 700 }} variant="h6">
                Login
              </Typography>
              <Box sx={{ mt: 1 }}>

                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{ my: 4 }}
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email"
                      inputProps={{ type: 'email' }}
                      error={Boolean(errors.email)}
                      helperText={
                        errors.email?'Email is required'
                          : ''
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 4,
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{ mb: 4 }}
                      variant="outlined"
                      fullWidth
                      id="password"
                      label="Password"
                      inputProps={{ type: 'password' }}
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password
                          ? errors.password.type === 'minLength'
                            ? 'Password length is more than 3'
                            : 'Password is required'
                          : ''
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>


                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />

                  <Button className='hvr-grow' type="submit" 
                    style={{ width: '100%', backgroundColor: '#202082', color: 'white', marginTop: '2rem', marginBottom: '2rem' }} >
                    Log In
                  </Button>
                
                
              </Box>
            </Box>
          </form>
        </Grid>
        

      </Grid>
    </ThemeProvider>
  );
}