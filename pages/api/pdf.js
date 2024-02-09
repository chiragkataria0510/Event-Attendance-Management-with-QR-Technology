import nextConnect from 'next-connect';
import pdf from 'html-pdf';
import QRCode from 'qrcode';
const handler = nextConnect();

handler.post(async (req, res) => {
  try {
    const { email,name ,mobile} = req.body; // Replace with the dynamic data you want to include
    const qrCodeDataUrl = await QRCode.toDataURL(`${process.env.DEPLOYED_URL}/attendance/${email}`);
    const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>CII CheckIn Pass</title>
        <style>
          .bg-light {
            background-color: #f8f9fa;
          }
    
          .my-10 {
            margin-top: 5rem;
            margin-bottom: 5rem;
          }
    
          .text-center {
            text-align: center;
          }
    
          .text-teal-700 {
            color: #202082;
          }
    
          .space-y-3 > * {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }
    
          .text-gray-700 {
            color: #4a5568;
          }
          .center {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 50%;
          }
        </style>
      </head>
      <body style="width:100%">
        <div class="container ">
          <div class="card my-10">
            <div style="padding: 4rem;" class="card-body ">
              <h1 class="h3 mb-2 text-center">3rd CII International Conference on Digitalisation, Robotics and Automation (DRA) – Industry 4.0</h1>
              <h5 style="font-size: 1.5rem;" class="text-teal-700  text-center">16-17 March 2023 | Hotel Crowne Plaza, Gurgaon</h5>
              <hr>
              <div class="space-y-3">
                <p  class="text-gray-700  text-center" style="font-size: 2rem;" >
                  Name : ${name}
                  <br/>
                  <br/>
                  Email : ${email}
                  <br/>
                  <br/>
                  Mobile : ${mobile}
                </p>
                <img class="center" src="${qrCodeDataUrl}" />
              </div>
              <hr>
            </div>
          </div>
        </div>
      </body>
    </html>
    
    

    
    `;

    const pdfOptions = { format: 'Letter' }; // Options for the PDF file
    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=CII_Check_IN.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default handler;
