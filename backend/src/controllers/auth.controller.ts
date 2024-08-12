import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';

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

export { registerUser };
