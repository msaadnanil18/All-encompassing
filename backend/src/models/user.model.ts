import mongoose from 'mongoose';
import { IUser } from '../interfaces/auth';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    refreshToken: {
      type: String,
    },
    themConfig: {
      token: {
        type: Map,
        of: Schema.Types.Mixed,
        default: () => ({ colorPrimary: '#129ab5', borderRadius: 8 }),
      },
      mode: {
        type: String,
        enum: ['DARK', 'LIGHT'],
        default: 'LIGHT',
      },
      isCompact: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: any
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return Jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
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

userSchema.plugin(mongoosePaginate);

export const User = mongoose.model<IUser>('User', userSchema);
