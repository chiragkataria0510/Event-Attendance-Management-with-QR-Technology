import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataStore } from '../../utils/DataStore';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import axios from 'axios'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const theme = createTheme();

export default function AlreadyRegistered() {
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

  const submitHandler = async ({ mobile,mobileCode }) => {

    closeSnackbar();
    try {
      const { data } = await axios.post('/api/fetchEntryByMobile', { mobile ,mobileCode});
      // console.log(data)
      Cookies.set('alreadyRegisteredUserData', data);
      router.push(redirect || '/already-registered/step2');
    } catch (err) {
      enqueueSnackbar("There is some error", { variant: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>

      <form onSubmit={handleSubmit(submitHandler)} >
        <Box
          sx={{
            my: 8,
            mx: 4,
          }}
        >
          <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => router.back()} />


          <Typography style={{ marginTop: 10 }} component="p" sx={{ fontWeight: 700 }} variant="h6">
            Enter the Mobile Number you used while Registration
          </Typography>
          <Box sx={{ mt: 1 }}>


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
                render={({ field }) => (
                  <TextField
                    sx={{ mb: 4 }}
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
              Submit
            </Button>

            <Typography textAlign="center">
              <Link href="/" style={{ color: "#202082" }}>Have not Registered? Click Here</Link>
            </Typography>

          </Box>
        </Box>
      </form>

    </ThemeProvider>
  );
}