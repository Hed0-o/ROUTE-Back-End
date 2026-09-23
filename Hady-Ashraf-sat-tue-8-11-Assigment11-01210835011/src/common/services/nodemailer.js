import nodemailer from "nodemailer";
import * as config from "../../../config/config.service.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export const checkEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Successfully connected to email!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

export const sendingEmailFormula = async (
  reciver,
  title,
  contetnt,
  htmlContetnt = "",
) => {
  try {
    const info = await transporter.sendMail({
      from: '"Route Revision App" <hadyashraf81@gmail.com>',
      to: reciver,
      subject: title,
      text: contetnt,
      html: htmlContetnt,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export const postVerificationTemplate = (
  otpCode = "",
  TTL = "__",
  userName = "User",
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F6F9; padding: 40px 10px;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="background-color: #2563EB; height: 6px;"></td>
          </tr>

          <!-- Header / App Name -->
          <tr>
            <td align="center" style="padding: 32px 40px 16px 40px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1E293B; letter-spacing: -0.5px;">
                Route Revision App
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 10px 40px 30px 40px; text-align: center;">
              
              <!-- Security Badge Icon -->
              <div style="display: inline-block; background-color: #EFF6FF; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; margin-bottom: 20px;">
                <span style="font-size: 28px; vertical-align: middle;">🔑</span>
              </div>

              <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #0F172A;">
                Verification Code
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Hi <strong>${userName}</strong>, use the following One-Time Password (otp) to complete your verification process:
              </p>

              <!-- otp Display Box -->
              <div style="background-color: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 10px; padding: 18px; margin: 0 auto 24px auto; max-width: 280px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #2563EB; letter-spacing: 10px; display: inline-block; margin-left: 10px;">
                  ${otpCode}
                </span>
              </div>

              <!-- Expiration & Security Notice -->
              <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                This code will expire in <strong>${TTL}</strong>. Do not share this code with anyone.
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="border-top: 1px solid #F1F5F9;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; background-color: #FAFAFA;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94A3B8;">
                © ${new Date().getFullYear()} Route Revision App. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                Automated Security Email
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
