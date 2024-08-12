import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import Jwt from 'jsonwebtoken';

import { generateVerificationToken, sendVerificationEmail } from '../utils';

const registerUser = async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body.payload;

  if ([name, email, username, password].some((field) => field?.trim() === '')) {
    res.status(400).json({ message: 'all fields are required' });
  }

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    res.status(400).json({ message: 'you are all ready exited' });
  }
  const user = await User.create({
    name,
    email,
    password,
    username,
  });

  const token = generateVerificationToken(user._id);
  await sendVerificationEmail(email, token);
  const createdUseer = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUseer) {
    throw new ApiError(500, {
      message: 'something went wrong while register the user',
    });
  }

  return res
    .status(201)
    .json({ createdUseer, message: 'user registered successfully' });
};

const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.isVerified) {
      return res.status(400).send('User already verified');
    }

    user.isVerified = true;
    await user.save();

    res.send('Email successfully verified');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
};

export { registerUser, verifyEmail };
