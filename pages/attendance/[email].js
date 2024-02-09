import Registrations from '../../models/Registrations';
import db from '../../utils/db';
import Layout from '../../Layout/Layout'
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';
export default function IndexPage({ data }) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  const markAttendance = async (email) => {
    closeSnackbar();
      const {data} = await axios.post('/api/attendance', { email });
      // console.log("data", data)
      enqueueSnackbar(data, { variant: 'success' });
  };



  return (
    <Layout>

      <Grid container justifyContent='center' alignItems='center' component="main" >
        <Grid container justifyContent='center' alignItems='center' item sx={{ pt: 7 }} sm={4} lg={7}>

          {data.length == 1 ? (
            <>
              <Typography textAlign={"center"} component="p" sx={{ fontWeight: 700 }} variant="h6">
                  <span style={{ color: "#202082" }}>Name:</span> {data[0]?.firstName} {data[0]?.lastName}
                <br />
                  <span style={{ color: "#202082" }}>Email:</span> {data[0]?.email}
                <br />
                  <span style={{ color: "#202082" }}>Mobile:</span> {data[0]?.mobile}
              </Typography>

              <Button className='hvr-grow' onClick={() => markAttendance(data[0]?.email)}
                style={{ width: '100%', backgroundColor: '#202082', color: 'white', marginTop: '2rem', marginBottom: '2rem' }} >
                Mark Attendance
              </Button>
            </>
          ) : (<>
          
          <Typography textAlign={"center"} component="p" sx={{ fontWeight: 700 }} variant="h6">
               There is No Registration Found
              </Typography>
          </>)}


        </Grid>
      </Grid>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const { email } = context.query;
  await db.connect();
  const data = await Registrations.find({ email: email }).lean()
  await db.disconnect();
  return {
    props: {
      data: data.map(db.convertDocToObj),
    },
  };
}
