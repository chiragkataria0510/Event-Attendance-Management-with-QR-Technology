import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import QRCode from 'qrcode.react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

export default function Step2() {
  useEffect(() => {
    const oldData = Cookies.getJSON("alreadyRegisteredUserData") || {};
    setFinalData(oldData);
  }, []);
  const router = useRouter();

  const [finalData, setFinalData] = useState([]);
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
        alignItems="center"
        justifyContent="center"
      >

        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          item
          xs={4}
          sx={{ paddingTop: "3rem" }}
        >
          {finalData.length != 0 ? (
            <>

              <Typography textAlign={"center"} component="p" sx={{ fontWeight: 700 }} variant="h6">
                <span style={{ color: "#202082" }}>Name:</span> {finalData[0].firstName} {finalData[0].lastName}
                <br />
                <span style={{ color: "#202082" }}>Email:</span> {finalData[0].email}
                <br />
                <span style={{ color: "#202082" }}>Mobile:</span> {finalData[0].mobile}
              </Typography>

              <div style={{ padding: "0.7rem" }}>
                {finalData ? (<> <QRCode value={`${process.env.DEPLOYED_URL}/attendance/${finalData[3]}`} /></>) : null}
              </div>


              <Typography textAlign={"center"} component="p" sx={{ fontWeight: 700, mt: 4 }} variant="h6">
                Generate and Download Your PASS for CheckIn
              </Typography>

              {pdfBuffer ? (
                <>
                  <Button sx={{ my: 2 }} variant="outlined" startIcon={<DownloadIcon />}>
                    <a href={URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }))} download="CII_Check_IN.pdf">
                      Download PASS
                    </a>
                  </Button>
                </>
              ) : isGenerating ? (
                <div> <CircularProgress /></div>
              ) : (<>
                <Button onClick={() => generatePdf(finalData[0].email, finalData[0].firstName + " " + finalData[0].lastName, finalData[0].mobile)} className='hvr-grow' type="submit"
                  style={{ backgroundColor: '#202082', color: 'white', marginTop: '2rem', marginBottom: '2rem' }} >
                  Generate PASS
                </Button>
              </>)}


            </>
          ) : (
            <>
              <Typography component="p" sx={{ fontWeight: 700 }} variant="h6">
                Sorry, We don't have Registration from this Mobile Number
              </Typography>

              <Typography component="p" sx={{ fontWeight: 700,color:"#202082" }} variant="h6">
                Please Check Your Mobile Number & Country Code
              </Typography>
      
            </>
          )}



        </Grid>
      </Grid>

      </Box>
    </>
  );
}
