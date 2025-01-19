import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import Jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { generateVerificationToken, sendVerificationEmail } from '../utils';

const gerateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {};
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'something went wrong while generating refresh and access tokens'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password, avatar } = req.body.payload;

  if ([name, email, username, password].some((field) => field?.trim() === '')) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    return res
      .status(201)
      .json(new ApiResponse(201, {}, 'Your are already exists'));
  }
  const user = await User.create({
    name,
    email,
    password,
    username,
    avatar,
  });

  const token = generateVerificationToken(user._id);

  await sendVerificationEmail(email, token);
  const createdUseer = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUseer) {
    return res.status(500).json({
      message: 'something went wrong while register the user',
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, 'user registered successfully'));
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { payload } = req.body;

  const { token } = payload;

  if (!token) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    const decoded = Jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email successfully verified' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { payload } = req.body;
  const { username, password } = payload;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(201).json(new ApiResponse(201, {}, 'User not found'));
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res
        .status(201)
        .json(new ApiResponse(201, {}, 'Your password is invalid'));
    }
    if (user && isPasswordValid) {
      const { accessToken, refreshToken } = await gerateAccessAndRefreshToken(
        user._id
      );

      const loggendInUser = await User.findById(user._id).select(
        '-password -refreshToken'
      );

      if (!(loggendInUser as any).isVerified) {
        return res
          .status(201)
          .json(new ApiResponse(201, {}, 'Your email is not verified'));
      }
      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { user: loggendInUser, accessToken, refreshToken },
            `Welcome ${loggendInUser?.name} you are logied In successfully`
          )
        );
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, 'Invalid credentials'));
    }
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, 'Invalid credentials'));
    console.log(error, '______error_____');
  }
});

const updateThemeConfig = asyncHandler(async (req, res) => {
  try {
    const { token, mode, isCompact } = req.body.payload;
    const { userId } = req.body.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(201).json({ message: 'User not found' });
    }

    if (token) {
      user.themConfig.token = token;
    }
    if (mode) {
      user.themConfig.mode = mode;
    }
    if (typeof isCompact === 'boolean') {
      user.themConfig.isCompact = isCompact;
    }

    await user.save();

    return res.status(200).json({
      message: 'Theme configuration updated successfully',
      themConfig: user,
    });
  } catch (error) {
    console.error('Error updating theme configuration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged out'));
});

export { registerUser, verifyEmail, loginUser, updateThemeConfig, logOutUser };
