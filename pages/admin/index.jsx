import React, { useContext } from "react";
import Registrations from '../../models/Registrations';
import db from '../../utils/db';
import Box from '@mui/material/Box';
import Layout from '../../Layout/Layout'
import { DataStore } from '../../utils/DataStore';
export default function IndexPage({ data }) {
  const { state } = useContext(DataStore);
  const { userInfo } = state;

  return (
    <Layout>
      {userInfo?.isAdmin ? (
        <Box style={{ overflowX: 'scroll' }} sx={{ width: '100%', typography: 'body1' }}>
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Registration Type</th>
                <th>Organisation</th>
                <th>Day 1 Attendance</th>
                <th>Day 2 Attendance</th>
                <th>Email</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {data.map((element) => {
                return (
                  <tr key={element._id} >
                    <td>{element?.firstName}</td>
                    <td>{element?.lastName}</td>
                    <td>{element?.registerationType}</td>
                    <td>{element?.organisation}</td>
                    <td>{element?.attendance1 ? 'Present' : 'Absent'}</td>
                    <td>{element?.attendance2 ? 'Present' : 'Absent'}</td>
                    <td>{element?.email.substring(0, 4)}.....{element?.email.substr(element?.email.length - 6)}</td>
                    <td>{element?.mobile.substring(0, 3)}.....{element?.mobile.substr(element?.mobile.length - 3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      ) : (
      <>
      This Data is only Available for Admin
      
      </>)}



    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const data = await Registrations.find({}).lean()
  await db.disconnect();
  return {
    props: {
      data: data.map(db.convertDocToObj),
    },
  };
}