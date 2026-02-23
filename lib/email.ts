import nodemailer from "nodemailer";

// Create a reusable transporter using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true" || false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Skipping email send to:", to);
      return false;
    }

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Vmatch"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// --- Templates ---

export const getNewLikeTemplate = (likerName: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
  <h2 style="color: #f97316;">Someone likes you! 🔥</h2>
  <p style="font-size: 16px; color: #333;">
    Good news! <strong>${likerName}</strong> just liked your profile on Vmatch.
  </p>
  <div style="margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/likes" 
       style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      View Your Likes
    </a>
  </div>
  <p style="font-size: 14px; color: #888;">
    Don't keep them waiting! Log in to see who it is.
  </p>
</div>
`;

export const getNewMatchTemplate = (matchName: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
  <h2 style="color: #f97316;">It's a Match! 🎉</h2>
  <p style="font-size: 16px; color: #333;">
    You and <strong>${matchName}</strong> have liked each other.
  </p>
  <div style="margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dms" 
       style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
      Send a Message
    </a>
  </div>
  <p style="font-size: 14px; color: #888;">
    Make the first move and say hi!
  </p>
</div>
`;
