import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import QRCode from 'qrcode.react';
import Cookies from 'js-cookie';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
export default function Step3() {
  const router = useRouter();
  // function send(email) {
  //   const data = axios.post('/api/email',
  //     {
  //       qrCodeData: `${process.env.DEPLOYED_URL}/attendance/${email}`,
  //       to: email,
  //       subject: "Registration Check In QR Code",
  //       text: "This is a test email from the Next.js Contact Form.",
  //     }
  //   );
  // }

  useEffect(() => {
    const oldData = Cookies.getJSON('registeringUserData') || {};
    if (!oldData) {
      router.push('/');
    }
    setFinalData(oldData)
    // send(oldData.email);

  }, []);


  const [finalData, setFinalData] = useState(null)
  const [pdfBuffer, setPdfBuffer] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);


  const generatePdf = async (email, name, mobile) => {
    setIsGenerating(true);
    const response = await fetch('/api/pdf', {
      method: 'POST',
      body: JSON.stringify({ email, name, mobile }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      setPdfBuffer(buffer);
    }
    setIsGenerating(false);
  };


  return (
    <>
     <Box
          sx={{
            my: 4,
            mx: 4,
          }}
        >
          <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => router.back()} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
     

          <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center" item xs={12} lg={8}  sx={{ paddingTop: "3rem" }}>
            <Typography textAlign={"center"} component="p" sx={{ fontWeight: 700 }} variant="h6">
              This is your Checkin QR Code.
            </Typography>
            <br/>
            <Typography textAlign={"center"} component="p" sx={{ fontWeight: 700 ,color:"#202082"}} variant="h6">
              Generate and Download Your PASS for CheckIn
            </Typography>
            <div style={{ padding: "3rem" }}>
              {finalData ? (<> <QRCode value={`${process.env.DEPLOYED_URL}/attendance/${finalData?.email}`} /></>) : null}
            </div>


            {pdfBuffer ? (
              <>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  <a href={URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }))} download="CII_Check_IN.pdf">
                    Download PASS
                  </a>
                </Button>
              </>
            ) : isGenerating ? (
              <div> <CircularProgress /></div>
            ) : (<>
              <Button onClick={() => generatePdf(finalData?.email, finalData?.data.firstName + " " + finalData?.data.lastName, finalData?.mobile)} className='hvr-grow' type="submit"
                style={{ backgroundColor: '#202082', color: 'white'}} >
                Generate PASS
              </Button>
            </>)}

          </Grid>
      </Grid>
        </Box>


    </>
  )
}
