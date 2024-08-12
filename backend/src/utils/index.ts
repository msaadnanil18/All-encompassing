import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const generateVerificationToken = (userId: string): string => {
  const token = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
  return token;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Please verify your email by clicking on the following link: ${process.env.CROS_ORIGIN}/verify-email?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('mailOptions', error);
  }
};
