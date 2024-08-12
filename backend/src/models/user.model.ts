import mongoose from 'mongoose';
import { IUser } from '../interfaces/auth';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
const { Schema } = mongoose;

const userSchema = new Schema<IUser>({
  name: {
    type: 'String',
    required: true,
  },
  username: {
    type: 'String',
    required: true,
  },
  email: {
    type: 'String',
    required: true,
  },
  password: {
    type: 'String',
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.fullname,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model<IUser>('User', userSchema);
