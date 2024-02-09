import nc from 'next-connect';
import Registrations from '../../models/Registrations';
import db from '../../utils/db';
const handler = nc();

handler.post(async (req, res) => {
    await db.connect();
    const data = await Registrations.find({ mobile: req.body.mobile, mobileCode: req.body.mobileCode }).limit(1)
    await db.disconnect();  
    res.send(data)
});

export default handler;
