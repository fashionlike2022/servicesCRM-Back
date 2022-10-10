import mongoose from 'mongoose';
import crypto from 'crypto';
import { customAlphabet } from 'nanoid';
import bcrypt from 'bcrypt';
import { roles } from '../../config/roles';
import { IUserDoc, IUserModel } from './user.interfaces';
import { toJSON } from '../../utils/toJSON';
import { paginate } from '../../utils/paginate';

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    AN: {
      type: String,
      required: true,
      default: () => customAlphabet('1234567890', 6)(),
      // Must be correlative number
      // count all documents user and add + 1
      // index: { unique: true },
      immutable: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value: string) {
        if (!value.match(/^\d+$/)) {
          throw new Error('Dni must contain only numbers');
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate(value: string) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastSession: {
      type: Date,
      required: false,
    },
    verificationToken: {
      type: String,
      required: true,
      index: true,
      default: () => crypto.randomBytes(24).toString('hex'),
      private: true, // used by the toJSON plugin
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Virtuals
userSchema.virtual('fullName').get(function (this: IUserDoc) {
  return this.firstName + this.lastName;
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  // return bcrypt.compare(password, user.password);
  return bcrypt.compareSync(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    // user.password = await bcrypt.hash(user.password, 8);
    const salt = await bcrypt.genSalt(10, 'a');
    user.password = bcrypt.hashSync(user.password, salt);
  }
  next();
});

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;
