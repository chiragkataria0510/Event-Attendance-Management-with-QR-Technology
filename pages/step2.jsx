import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MenuItem } from '@material-ui/core';
import Button from '@mui/material/Button';
import Select from "react-select";
import csc from "country-state-city";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Link from 'next/link'
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const theme = createTheme();

const PREFIX_OPTIONS = [
    {
        value: 'mr',
        label: 'Mr.',
    },
    {
        value: 'ms',
        label: 'Ms.',
    },
    {
        value: 'mrs',
        label: 'Mrs.',
    },
];


export default function Step2() {
    const {
        register,
        setValue,
        handleSubmit,
        control, watch,
        formState: { errors },
    } = useForm({

    });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const { redirect } = router.query; // login?redirect=/shipping
    useEffect(() => {
        const oldData = Cookies.getJSON('registeringUserData');
        if (!oldData) {
            router.push('/');
        }
    }, [router]);


    const oldData = Cookies.getJSON('registeringUserData') || {};
    const submitHandler = async ({ registerationType, prefix, firstName, lastName, organisation, company, address, country, state, city, pinCode }) => {
        closeSnackbar();
        try {
            const data = { "registerationType": registerationType, "prefix": prefix, "firstName": firstName, "lastName": lastName, "organisation": organisation, "company": company, "address": address, "country": country.label, "state": state.label, "city": city.label, "pinCode": pinCode }
            const newData = { ...oldData, data }
            Cookies.set('registeringUserData', newData);

            await axios.post('/api/addData', { prefix, firstName, lastName, email: oldData.email, mobileCode: oldData.mobileCode, mobile: oldData.mobile, organisation, company, registerationType, address, country: country.label, state: state.label, city: city.label, pinCode });
            router.push(redirect || '/step3');

        } catch (err) {
            enqueueSnackbar("This Email/Mobile is already used for Registration", { variant: 'error' });
        }
    };

    const type = watch('registerationType'); // get the value of the gender field
    const [pinCode, setPinCode] = useState();

    const countries = csc.getAllCountries();

    const updatedCountries = countries.map((country) => ({
        label: country.name,
        value: country.id,
        ...country,
    }));

    const updatedStates = (countryId) =>
        csc.getStatesOfCountry(countryId).map((state) => ({ label: state.name, value: state.id, ...state }));

    const updatedCities = (stateId) =>
        csc.getCitiesOfState(stateId).map((city) => ({ label: city.name, value: city.id, ...city }));

    const handleCountryChange = (selectedOption) => {
        setValue("country", selectedOption);
        setValue("state", "");
        setValue("city", "");
    };

    const handleStateChange = (selectedOption) => {
        setValue("state", selectedOption);
        setValue("city", "");
    };

    const handleCityChange = (selectedOption) => {
        setValue("city", selectedOption);
    };

    return (
        <ThemeProvider theme={theme}>

            <form onSubmit={handleSubmit(submitHandler)} >
                <Box
                    sx={{
                        my: 4,
                        mx: 4,
                    }}
                >
                    <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => router.back()} />
                    <Typography component="p" sx={{ fontWeight: 700 }} variant="h6">
                        Registeration Type
                    </Typography>
                    <Box sx={{ mt: 1 }}>

                        <Controller
                            name="registerationType"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            defaultValue="individual"
                            render={({ field }) => (
                                <RadioGroup {...field} sx={{ my: 2 }} row>
                                    <FormControlLabel value="organisation" control={<Radio />} label="Organisation" />
                                    <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                                </RadioGroup>
                            )}
                        ></Controller>


                        <Grid  spacing={4}>

                            <Grid item md={12} lg={2} sx={{ my: 2 }}>
                                <Controller rules={{
                                    required: true,
                                }}
                                    name="prefix"
                                    control={control}
                                    defaultValue="mr"
                                    render={({ field }) => (
                                        <TextField
                                            select
                                            fullWidth
                                            label="Prefix"
                                            variant="outlined"
                                            {...field}
                                        >
                                            {PREFIX_OPTIONS.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item md={12} lg={5} sx={{ my: 2 }}>
                                <Controller rules={{
                                    required: true,
                                }}
                                    name="firstName"
                                    control={control}
                                    defaultValue={oldData?.data?.firstName}
                                    render={({ field }) => (
                                        <TextField

                                            variant="outlined"
                                            fullWidth
                                            label="First Name"
                                            helperText={
                                                errors.firstName ? 'It is required'
                                                    : ''
                                            }
                                            {...field}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item md={12} lg={5} sx={{ my: 2 }}>
                                <Controller rules={{ required: true }}
                                    name="lastName"
                                    control={control}
                                    defaultValue={oldData?.data?.lastName}
                                    render={({ field }) => (
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            label="Last Name"
                                            helperText={
                                                errors.lastName ? 'It is required'
                                                    : ''
                                            }
                                            {...field}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>



                        {type === 'organisation' && (
                            <Controller
                                name="organisation"
                                control={control}
                                defaultValue={oldData?.data?.organisation}
                                render={({ field }) => (
                                    <TextField
                                        sx={{ my: 2 }}
                                        variant="outlined"
                                        fullWidth
                                        label="Organization"
                                        {...field}
                                    />
                                )}
                            />
                        )}

                        <Box sx={{ my: 2 }}>

                            <Controller
                                rules={{
                                    required: true,
                                }}
                                name="company"
                                control={control}
                                defaultValue={oldData?.data?.company}
                                render={({ field }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Company Name"
                                        helperText={
                                            errors.address ? 'It is required'
                                                : ''
                                        }
                                        {...field}
                                    />
                                )}
                            />

                            <Typography variant='h9' component='p' style={{}}>
                                * If you are Freelancer, Please Enter Freelancer
                            </Typography>
                        </Box>


                        <Controller rules={{
                            required: true,
                        }}
                            name="address"
                            control={control}
                            defaultValue={oldData?.data?.address}
                            render={({ field }) => (
                                <TextField
                                    sx={{ my: 2 }}
                                    variant="outlined"
                                    fullWidth
                                    label="Address"
                                    multiline
                                    helperText={
                                        errors.address ? 'It is required'
                                            : ''
                                    }
                                    rows={2}
                                    {...field}
                                />
                            )}
                        />











                        <div style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                            <Typography variant='p' component='p' style={{}}>
                                Country
                            </Typography>

                            <Controller rules={{
                                required: true,
                            }}
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isRequired={true}
                                        {...register("country")}
                                        name="country"
                                        label="Country"
                                        options={updatedCountries}
                                        onChange={handleCountryChange}
                                    />
                                )}
                            />

                        </div>
                        <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                            <Typography variant='p' component='p' style={{}}>
                                State/Province
                            </Typography>
                            <Controller rules={{
                                required: true,
                            }}
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isRequired={true}
                                        {...register("state")}
                                        name="state"
                                        label="State"
                                        options={updatedStates(watch("country") ? watch("country").value : null)}
                                        onChange={handleStateChange}
                                    />
                                )}
                            />

                        </div>
                        <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                            <Typography variant='p' component='p' style={{}}>
                                City
                            </Typography>
                            <Controller rules={{
                                required: true,
                            }}
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isRequired={true}
                                        {...register("city")}
                                        name="city"
                                        label="City"
                                        options={updatedCities(watch("state") ? watch("state").value : null)}
                                        onChange={handleCityChange}
                                    />
                                )}
                            />

                        </div>




                        <Controller
                            name="pinCode"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            defaultValue={pinCode}
                            render={({ field }) => (
                                <TextField
                                    sx={{ mb: 4 }}
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    id="pinCode"
                                    label="Pin Code"
                                    inputProps={{ type: 'number' }}
                                    error={Boolean(errors.pinCode)}
                                    helperText={
                                        errors.pinCode ? 'It is required'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        ></Controller>


                        <Stack direction="row" sx={{ my: 2 }} spacing={2}>
                            <Link href="/">
                                <Button className='hvr-grow' type="submit"
                                    style={{ width: '100%', backgroundColor: '#202082', color: 'white', marginTop: '2rem', marginBottom: '2rem' }} >
                                    Back
                                </Button>
                            </Link>
                            <Button className='hvr-grow' type="submit"
                                style={{ width: '100%', backgroundColor: '#202082', color: 'white', marginTop: '2rem', marginBottom: '2rem' }} >
                                Next
                            </Button>
                        </Stack>

                    </Box>
                </Box>
            </form>

        </ThemeProvider>
    );
}