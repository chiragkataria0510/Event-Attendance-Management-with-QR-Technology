import nodemailer from "nodemailer";
import nc from 'next-connect';
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
const handler = nc();


// Create a transport object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "vermaapoorva0510@gmail.com",
    pass: "ryjpymnspsfkodap",
  },
});

handler.post(async (req, res) => {

//  // Generate the QR code image and convert it to a data URL
//  const buffer = await QRCode.toBuffer(req.body.qrCodeData);
//  const parser = new DatauriParser();
//  const dataURI = parser.format('.png', buffer).content;

//  console.log({"dataURI":dataURI})


//  // Save the data URL to a file
//  const fileName = "qrcode.png";
//  const filePath = path.join(process.cwd(), "public", fileName);
//  fs.writeFileSync(filePath, dataURI.replace(/^data:image\/png;base64,/, ""), "base64");




//  console.log({"fileName":fileName,"filePath":filePath})




  try {
    
    await transporter.sendMail({
      from: "vermaapoorva0510@gmail.com",
      to:req.body.to,
      subject:req.body.subject,
      text:req.body.text,
      // attachments: [
      //   {
      //     filename: fileName,
      //     path: filePath,
      //     cid: "qrcode-image",
      //   },
      // ],
      // html: '<img src="cid:qrcode-image" alt="QR code" />',
      
    });
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
  res.send("success")
});

export default handler;





