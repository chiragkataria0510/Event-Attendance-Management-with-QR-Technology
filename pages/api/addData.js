import nc from 'next-connect';
import Registrations from '../../models/Registrations';
import db from '../../utils/db';
const handler = nc();

handler.post(async (req, res) => {

    await db.connect();
    const newRegistrations = new Registrations({
      prefix: req.body.prefix,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileCode: req.body.mobileCode,
      mobile: req.body.mobile,
      organisation: req.body.organisation,
      company: req.body.company,
      registerationType: req.body.registerationType,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      pinCode: req.body.pinCode
      });
      await newRegistrations.save();
      // console.log("newRegistrations",newRegistrations)
      await db.disconnect();
      res.send("success")
});

export default handler;
