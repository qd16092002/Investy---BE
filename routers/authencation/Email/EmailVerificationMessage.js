import express from "express";
import nodemailer from "nodemailer";
// import crypto from "crypto";
// import jwt from "jsonwebtoken";

const router = express.Router();
router.use(express.json());

// Cấu hình Nodemailer cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "investy.noreply@gmail.com",
    pass: "sopbbfxioegjncgv",
  },
});

const otpMap = new Map();

// Gửi mã OTP qua email
router.post("/sendotp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  const otp = generateOTP(6); // Tạo mã OTP
  // Lưu trữ mã OTP trong otpMap
  otpMap.set(email, otp);

  sendOTP(email, otp) // Gửi mã OTP qua email
    .then(() => {
      res.json({ message: "OTP sent successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to send OTP." });
    });
});

// Xác minh OTP
router.post("/verifyotp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }
  const savedOtp = otpMap.get(email);
  if (!savedOtp) {
    return res.status(400).json({ error: "OTP is not sent for this email." });
  }

  if (otp !== savedOtp.toString()) {
    return res.status(401).json({ error: "OTP verification failed." });
  }

  otpMap.delete(email);

  res.json({ message: "OTP verification successful." });
});

function generateOTP(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: "investy.noreply@gmail.com", // Địa chỉ email gửi
    to: email, // Địa chỉ email nhận
    subject: 'Investy | Xác minh tài khoản Investy',
    html: `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
    <style>
      /* Your CSS code goes here */
      body {
        font-family: Inter, sans-serif;
        background-color: #CEFFF6;
        padding: 0px 15%;
      }
  
      .white {
        justify-content: center;
        background-color: #ffffff;
        height: 100%;
        padding-top: 40px;
      }
  
      .header {
        display: flex;
        margin-right: 10%;
        gap: 10%
      }
  
      .header a {
        font-family: Inter;
        font-size: 1.1vw;
        font-weight: 400;
        line-height: 15.73px;
        text-align: center;
        color: #007567;
        text-decoration: none;
        margin-top: 2vw;
      }
  
      @media screen and (max-width: 800px) {
        .header a {
          font-family: Inter;
          font-size: 2.1vw;
          font-weight: 400;
          line-height: 15.73px;
          text-align: center;
          color: #007567;
          text-decoration: none;
          margin-top: 2vw;
        }
      }
  
      .header a:hover {
        text-decoration: underline;
      }
  
      .img {
        height: 5vw;
        width: 5vw;
      }
  
      .title {
        margin-left: auto;
        margin-top: 50px;
        font-family: Inter;
        font-size: 2.3vw;
        font-weight: 700;
        line-height: 21.78px;
        text-align: center;
        color: #007567;
      }
  
      @media screen and (max-width: 800px) {
        .title {
          font-size: 14px;
        }
      }
  
      .content {
        margin-top: 60px;
        text-align: left;
        margin-left: 10%;
        margin-right: 10%;
  
      }
  
      .content .tite1 {
        font-family: Inter;
        font-size: 1.1vw;
        font-weight: 300;
        line-height: 15.73px;
        text-align: left;
      }
  
      .content .title22 {
        font-family: Inter;
        font-size: 1.5vw;
        font-weight: 700;
        line-height: 15.73px;
        text-align: left;
        margin-top: 20px;
      }
  
      @media screen and (max-width: 800px) {
        .content .title22 {
          font-family: Inter;
          font-size: 3vw;
          font-weight: 700;
          line-height: 15.73px;
          text-align: left;
          margin-top: 20px;
        }
      }
  
      .content .tite2 a:hover {
        text-decoration: underline;
      }
  
      .contact {
        font-family: Inter;
        font-size: 2.1vw;
        font-weight: 700;
        line-height: 15.73px;
        text-align: left;
        color: #ffffff;
      }
  
      @media screen and (max-width: 800px) {
        .contact {
          font-family: Inter;
          font-size: 2.5vw;
          font-weight: 700;
          line-height: 15.73px;
          text-align: left;
          color: #ffffff;
        }
      }
  
      .infor {
        font-family: Inter;
        font-size: 0.9vw;
        font-weight: 400;
        line-height: 1.5vw;
        text-align: left;
        color: #ffffff;
      }
  
      @media screen and (max-width: 800px) {
        .infor {
          font-family: Inter;
          font-size: 2vw;
          font-weight: 400;
          line-height: 15px;
          text-align: left;
          color: #ffffff;
        }
      }
    </style>
  </head>
  
  <body>
    <div class="white">
      <div class="header" style="margin-left: 10%; gap: 10%; display: flex;">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/investy-b17a1.appspot.com/o/host%2Fusers%2Favatars%2F1.png009216e7-e558-4f65-bed1-5591f36161ea?alt=media&token=dd855ae3-95e8-445a-8bf9-838c9071a520"
          class="img"></img>
        <a style="margin-left: 10%;" href="https://investy.io.vn/">Website</a>
        <a style="margin-left: 10%;" href="https://www.facebook.com/investy.platform">Fanpage</a>
        <a style="margin-left: 10%;" href="https://www.linkedin.com/company/investy-platform">Linkedin</a>
        <a style="margin-left: 10%;" href="https://www.youtube.com/@Investyplatform">Youtube</a>
      </div>
      <div class="title">Xác minh tài khoản Investy</div>
      <div class="content">
        <div class="title1">Kính gửi người dùng Investy!</div>
        <div class="title2" style="margin-top: 20px;line-height: 25px;">
          Mã xác nhận bạn cần dùng để truy cập vào Tài khoản Google của mình (${email}) là:
        </div>
        <div class="title22">
        ${otp}</div>
        <div class="title2" style="margin-top: 20px; line-height: 25px;">Nếu bạn không yêu cầu xác minh này thì có thể là
          ai đó đang tìm cách truy cập vào Tài khoản Investy ${email}. <span class="title2"
            style="margin-top: 20px; line-height: 25px; font-weight: 700;">Không chuyển tiếp hoặc cung cấp
            link cho bất kỳ ai.</span>
        </div>
        <div class="title2" style="margin-top: 20px;line-height: 25px;">
          Trân trọng!</div>
        <div class="title2" style="line-height: 25px;">
          Nhóm tài khoản Investy</div>
      </div>
      <div class="footer" style="margin-top: 40px; width: 95%; background-color: #00A789; padding-top: 30px; padding-bottom: 40px;
                  padding-left: 5%;">
        <div class="contact" style="margin-top: 30px;">Contact us:</div>
        <div class="infor" style="margin-top: 20px;">Website: <a href="https://investy.io.vn/"
            style="color: #ffffff; text-decoration: none;">investy.io.vn</a>
        </div>
        <div class="infor" style="margin-top: 10px;">Facebook: <a href="https://www.facebook.com/investy.platform"
            style=" color: #ffffff; text-decoration: none;">facebook.com/investy.platform</a></div>
        <div class="infor" style="margin-top: 10px;">LinkedIn: <a href="https://www.linkedin.com/company/investy-platform"
            style=" color: #ffffff; text-decoration: none;">linkedin.com/company/investy-platform</a></div>
        <div class="infor" style="margin-top: 10px;">Email: support@investy.iov.vn</div>
      </div>
    </div>
  </body>
  
  </html>`,
    disableReplyTo: true
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

//email invite
router.post('/send-email', async (req, res) => {
  const { to, subject, text, user } = req.body;

  // Define email options
  const mailOptions = {
    from: "investy.noreply@gmail.com",
    to,
    subject,
    text: `Mời bạn tham gia hệ thống Investy: http://localhost:3003/ qua lời mời của ${user}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});
router.post('/emailnoreply', async (req, res) => {
  try {
    const { to, fullName, job, nameCompany } = req.body;
    const text = `
      Hello,

      This is a plain text email.

      Regards,
      Your Name
      `;
    const subject = 'Investy | CV vừa được chuyển tới bạn'
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
        <style>
            /* Your CSS code goes here */
            body {
              font-family: Inter, sans-serif;
              background-color: #CEFFF6;
              padding: 0px 15%;
          }
  
          .white {
              justify-content: center;
              background-color: #ffffff;
              height: 100%;
              padding-top: 40px;
          }
  
          .header {
            display: flex;
            margin-right: 10%;
            gap: 10%
          }
  
          .header a {
              font-family: Inter;
              font-size: 1.1vw;
              font-weight: 400;
              line-height: 15.73px;
              text-align: center;
              color: #007567;
              text-decoration: none;
              margin-top: 2vw;
          }
          @media screen and (max-width: 800px) {
            .header a {
                font-family: Inter;
                font-size: 2.1vw;
                font-weight: 400;
                line-height: 15.73px;
                text-align: center;
                color: #007567;
                text-decoration: none;
                margin-top: 2vw;
            }
        }
          .header a:hover {
              text-decoration: underline;
          }
  
          .img {
              height: 5vw;
              width: 5vw;
          }
  
          .title {
            margin-left: auto;
            margin-top: 50px;
            font-family: Inter;
            font-size: 2.3vw;
            font-weight: 700;
            line-height: 21.78px;
            text-align: center;
            color: #007567;
        }

        @media screen and (max-width: 800px) {
            .title {
                font-size: 14px;
            }
        }
  
          .content {
              margin-top: 60px;
              text-align: left;
              margin-left: 10%;
              margin-right: 10%;
  
          }
  
          .content .tite1 {
              font-family: Inter;
              font-size: 1.1vw;
              font-weight: 300;
              line-height: 15.73px;
              text-align: left;
          }
  
          .content .tite2 {
              font-family: Inter;
              font-size: 1.1vw;
              font-weight: 300;
              line-height: 15.73px;
              text-align: left;
              margin-top: 20px;
          }
  
          .content .tite2 a:hover {
              text-decoration: underline;
          }
  
          .contact {
            font-family: Inter;
            font-size: 2.1vw;
            font-weight: 700;
            line-height: 15.73px;
            text-align: left;
            color: #ffffff;
          }
          @media screen and (max-width: 800px) {
            .contact {
                font-family: Inter;
                font-size: 2.5vw;
                font-weight: 700;
                line-height: 15.73px;
                text-align: left;
                color: #ffffff;
            }
        }
          .infor {
            font-family: Inter;
            font-size: 0.9vw;
            font-weight: 400;
            line-height: 1.5vw;
            text-align: left;
            color: #ffffff;
          }
          @media screen and (max-width: 800px) {
            .infor {
                font-family: Inter;
                font-size: 2vw;
                font-weight: 400;
                line-height: 15px;
                text-align: left;
                color: #ffffff;
            }
        }
        </style>
    </head>
    
    <body>
        <div class="white">
            <div class="header" style="margin-left: 10%; gap: 10%; display: flex;">
                <img src="https://firebasestorage.googleapis.com/v0/b/investy-b17a1.appspot.com/o/host%2Fusers%2Favatars%2F1.png009216e7-e558-4f65-bed1-5591f36161ea?alt=media&token=dd855ae3-95e8-445a-8bf9-838c9071a520"
                    class="img"></img>
                <a style="margin-left: 10%;"  href="https://investy.io.vn/">Website</a>
                <a style="margin-left: 10%;"  href="https://www.facebook.com/investy.platform">Fanpage</a>
                <a style="margin-left: 10%;"  href="https://www.linkedin.com/company/investy-platform">Linkedin</a>
                <a style="margin-left: 10%;"  href="https://www.youtube.com/@Investyplatform">Youtube</a>
            </div>
            <div class="title">Bạn đã có ứng viên cho job tuyển dụng hôm nay!</div>
            <div class="content">
                <div class="title1">Kính gửi người dùng Investy!</div>
                <div class="title2" style="margin-top: 20px;line-height: 25px;">
                    Hiện tại, bạn đẫ nhận được một CV ứng tuyển của ứng viên trên hệ thống Investy. CV và thông tin của ứng
                    viên đã được gửi tại mục “Sent CV”.</div>
                <div class="title2" style="font-weight: 700; margin-top: 20px; line-height: 25px;">Ứng viên ${fullName} –
                    Ứng tuyển vị trí
                    ${job} tại công
                    ty ${nameCompany}</div>
                <div class="title2" style="margin-top: 20px; line-height: 25px;">Mọi thắc mắc xin vui lòng liên hệ Investy
                    Support Center tại
                    <a style="color: black; text-decoration: underline; &:hover {
                        text-decoration: underline
                    };" href="mailto:support@investy.io.vn" target="_blank">support@investy.io.vn</a>
                    hoặc hotline (+84) 333 991 505.
                </div>
                <div class="title2" style="margin-top: 20px;line-height: 25px;">
                    Trân trọng!</div>
                <div class="title2" style="line-height: 25px;">
                    Nhóm tài khoản Investy</div>
            </div>
            <div class="footer" style="margin-top: 40px; width: 95%; background-color: #00A789; padding-top: 30px; padding-bottom: 40px;
                padding-left: 5%;">
                <div class="contact" style="margin-top: 30px;">Contact us:</div>
                <div class="infor" style="margin-top: 20px;">Website: <a href="https://investy.io.vn/"
                        style="color: #ffffff; text-decoration: none;">investy.io.vn</a>
                </div>
                <div class="infor" style="margin-top: 10px;">Facebook: <a href="https://www.facebook.com/investy.platform"
                        style=" color: #ffffff; text-decoration: none;">facebook.com/investy.platform</a></div>
                <div class="infor" style="margin-top: 10px;">LinkedIn: <a href="https://www.linkedin.com/company/investy-platform"
                        style=" color: #ffffff; text-decoration: none;">linkedin.com/company/investy-platform</a></div>
                <div class="infor" style="margin-top: 10px;">Email: support@investy.iov.vn</div>
            </div>
        </div>
    </body>
    
    </html>`;
    // Tùy chọn cho email
    let mailOptions = {
      from: "investy.noreply@gmail.com",
      to,
      subject,
      text: text,
      html: htmlContent,
      // Tắt một phản hồi tự động sau khi gửi email
      // Tùy chọn này không phải làm việc với tất cả các dịch vụ email, vì vậy hãy kiểm tra cẩn thận
      // Một số dịch vụ email vẫn có thể tạo ra các phản hồi tự động
      // Đọc tài liệu của dịch vụ email bạn sử dụng để biết thêm thông tin
      // Ví dụ: https://nodemailer.com/usage/#sending-messages
      disableReplyTo: true
    };

    // Gửi email mà không chờ đợi phản hồi từ người nhận
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.status(200).json({ message: 'Email sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/continue_with_services', async (req, res) => {
  try {
    const { to, email, service, price } = req.body;
    const text = `
      Hello,

      This is a plain text email.

      Regards,
      Your Name
      `;
    const subject = 'Investy | Bạn có người đăng ký dịch vụ hôm nay'
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
      <style>
        /* Your CSS code goes here */
        body {
          font-family: Inter, sans-serif;
          background-color: #CEFFF6;
          padding: 0px 15%;
        }
    
        .white {
          justify-content: center;
          background-color: #ffffff;
          height: 100%;
          padding-top: 40px;
        }
    
        .header {
          display: flex;
          margin-right: 10%;
          gap: 10%
        }
    
        .header a {
          font-family: Inter;
          font-size: 1.1vw;
          font-weight: 400;
          line-height: 15.73px;
          text-align: center;
          color: #007567;
          text-decoration: none;
          margin-top: 2vw;
        }
    
        @media screen and (max-width: 800px) {
          .header a {
            font-family: Inter;
            font-size: 2.1vw;
            font-weight: 400;
            line-height: 15.73px;
            text-align: center;
            color: #007567;
            text-decoration: none;
            margin-top: 2vw;
          }
        }
    
        .header a:hover {
          text-decoration: underline;
        }
    
        .img {
          height: 5vw;
          width: 5vw;
        }
    
        .title {
          margin-left: auto;
          margin-top: 50px;
          font-family: Inter;
          font-size: 2.3vw;
          font-weight: 700;
          line-height: 21.78px;
          text-align: center;
          color: #007567;
        }
    
        @media screen and (max-width: 800px) {
          .title {
            font-size: 14px;
          }
        }
    
        .content {
          margin-top: 60px;
          text-align: left;
          margin-left: 10%;
          margin-right: 10%;
    
        }
    
        .content .tite1 {
          font-family: Inter;
          font-size: 1.1vw;
          font-weight: 300;
          line-height: 15.73px;
          text-align: left;
        }
    
        .content .tite2 {
          font-family: Inter;
          font-size: 1.1vw;
          font-weight: 300;
          line-height: 15.73px;
          text-align: left;
          margin-top: 20px;
        }
    
        .content .tite2 a:hover {
          text-decoration: underline;
        }
    
        .contact {
          font-family: Inter;
          font-size: 2.1vw;
          font-weight: 700;
          line-height: 15.73px;
          text-align: left;
          color: #ffffff;
        }
    
        @media screen and (max-width: 800px) {
          .contact {
            font-family: Inter;
            font-size: 2.5vw;
            font-weight: 700;
            line-height: 15.73px;
            text-align: left;
            color: #ffffff;
          }
        }
    
        .infor {
          font-family: Inter;
          font-size: 0.9vw;
          font-weight: 400;
          line-height: 1.5vw;
          text-align: left;
          color: #ffffff;
        }
    
        @media screen and (max-width: 800px) {
          .infor {
            font-family: Inter;
            font-size: 2vw;
            font-weight: 400;
            line-height: 15px;
            text-align: left;
            color: #ffffff;
          }
        }
      </style>
    </head>
    
    <body>
      <div class="white">
        <div class="header" style="margin-left: 10%; gap: 10%; display: flex;">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/investy-b17a1.appspot.com/o/host%2Fusers%2Favatars%2F1.png009216e7-e558-4f65-bed1-5591f36161ea?alt=media&token=dd855ae3-95e8-445a-8bf9-838c9071a520"
            class="img"></img>
          <a style="margin-left: 10%;" href="https://investy.io.vn/">Website</a>
          <a style="margin-left: 10%;" href="https://www.facebook.com/investy.platform">Fanpage</a>
          <a style="margin-left: 10%;" href="https://www.linkedin.com/company/investy-platform">Linkedin</a>
          <a style="margin-left: 10%;" href="https://www.youtube.com/@Investyplatform">Youtube</a>
        </div>
        <div class="title">Bạn đã có người đăng ký dịch vụ hôm nay!</div>
        <div class="content">
          <div class="title1">Kính gửi người dùng Investy!</div>
          <div class="title2" style="margin-top: 20px;line-height: 25px;">
            Hiện tại, bạn đẫ nhận được một đơn hàng trên hệ thống Investy. Thông tin của người mua hàng của bạn là:</div>
          <div class="title2" style="font-weight: 700; margin-top: 20px; line-height: 25px;">
            Người mua ${email} cho đơn hàng ${service} với giá ${price}
          </div>
          <div class="title2" style="margin-top: 20px; line-height: 25px;">Mọi thắc mắc xin vui lòng liên hệ Investy
            Support Center tại
            <a style="color: black; text-decoration: underline; &:hover {
                            text-decoration: underline
                        };" href="mailto:support@investy.io.vn" target="_blank">support@investy.io.vn</a>
            hoặc hotline (+84) 333 991 505.
          </div>
          <div class="title2" style="margin-top: 20px;line-height: 25px;">
            Trân trọng!</div>
          <div class="title2" style="line-height: 25px;">
            Nhóm tài khoản Investy</div>
        </div>
        <div class="footer" style="margin-top: 40px; width: 95%; background-color: #00A789; padding-top: 30px; padding-bottom: 40px;
                    padding-left: 5%;">
          <div class="contact" style="margin-top: 30px;">Contact us:</div>
          <div class="infor" style="margin-top: 20px;">Website: <a href="https://investy.io.vn/"
              style="color: #ffffff; text-decoration: none;">investy.io.vn</a>
          </div>
          <div class="infor" style="margin-top: 10px;">Facebook: <a href="https://www.facebook.com/investy.platform"
              style=" color: #ffffff; text-decoration: none;">facebook.com/investy.platform</a></div>
          <div class="infor" style="margin-top: 10px;">LinkedIn: <a href="https://www.linkedin.com/company/investy-platform"
              style=" color: #ffffff; text-decoration: none;">linkedin.com/company/investy-platform</a></div>
          <div class="infor" style="margin-top: 10px;">Email: support@investy.iov.vn</div>
        </div>
      </div>
    </body>
    
    </html>`;
    // Tùy chọn cho email
    let mailOptions = {
      from: "investy.noreply@gmail.com",
      to,
      subject,
      text: text,
      html: htmlContent,
      disableReplyTo: true
    };

    // Gửi email mà không chờ đợi phản hồi từ người nhận
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.status(200).json({ message: 'Email sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
