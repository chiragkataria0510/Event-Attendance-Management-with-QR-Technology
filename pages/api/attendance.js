
import nc from 'next-connect';
import Registrations from '../../models/Registrations';
import db from '../../utils/db';

const handler = nc();


handler.post(async (req, res) => {
  await db.connect();
  const findResult = await Registrations.find({ email: req.body.email })
  if(findResult[0].attendance2 == true){
    res.send('Attendance is Already Marked' );
  }
  findResult[0].attendance2 = true;
  await  findResult[0].save();
  await db.disconnect();
  res.send('Attendance Marked Successfully');

});

export default handler;
