import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataStore } from '../utils/DataStore';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Link from 'next/link'

const theme = createTheme();

export default function Index() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state } = useContext(DataStore);
  const { userInfo } = state;

  useEffect(() => {
  }, [userInfo, router]);
  const oldData = Cookies.getJSON('registeringUserData') || {};

  const [email, setEmail] = useState(oldData?.email);
  const [mobile, setMobile] = useState(oldData?.mobile);

  const submitHandler = async ({ email, mobile, mobileCode }) => {
    closeSnackbar();
    try {
      // Cookies.set('registeringUserData', { "email": email, "mobile": mobile });
      const currentData = Cookies.getJSON('registeringUserData') || {};
      currentData.email = email;
      currentData.mobileCode = mobileCode;
      currentData.mobile = mobile;
      Cookies.set('registeringUserData', currentData);
      router.push(redirect || '/step2');
    } catch (err) {
      enqueueSnackbar("There is some error", { variant: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>



      <form onSubmit={handleSubmit(submitHandler)} >
        <Box
          sx={{
            my: 2,
            mx: 4,
          }}
        >
          <Typography textAlign="center" component="h3" sx={{ fontWeight: 700, color: "#202082", my: 3 }} variant="h4">
            3rd CII International Conference on DRA - Industry 4.0
          </Typography>
          <Typography textAlign="center" component="p" sx={{ fontWeight: 700 }} variant="h6">
            Register Here
          </Typography>
          <Box sx={{ mt: 1 }}>

            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={email}
              render={({ field }) => (
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ my: 4 }}
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Enter your Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email ? 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>


            <Stack direction="row" spacing={2}>

              <Controller rules={{ required: true }}
                name="mobileCode"
                control={control}
                defaultValue="91"
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    label="Country Code"
                    helperText={
                      errors.mobileCode ? 'It is required'
                        : ''
                    }
                    {...field}
                  />
                )}
              />

              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: true,
                  maxLength: 10, // Maximum length of 10 characters
                  minLength: 10, // Minimum length of 3 characters
                }}
                defaultValue={mobile}
                render={({ field }) => (
                  <TextField
                    sx={{ mb: 4 }}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    variant="outlined"
                    fullWidth
                    id="mobile"
                    label="Enter your Mobile"
                    inputProps={{ type: 'number' }}
                    error={Boolean(errors.mobile)}
                    helperText={
                      errors.mobile
                        ? (errors.mobile.type === 'minLength' || errors.mobile.type === 'maxLength') ? 'Mobile length must be 10'
                          : 'Mobile is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>

            </Stack>
            <Button className='hvr-grow' type="submit"
              style={{ width: '100%', backgroundColor: '#202082', color: 'white', marginTop: '2rem', marginBottom: '2rem' }} >
              Next
            </Button>

            <Typography textAlign="center">
              <Link href="/already-registered" style={{ color: "#202082" }}>Have You Already Registered? Get Your Pass Here</Link>
            </Typography>
          </Box>
        </Box>
      </form>

    </ThemeProvider>
  );
}