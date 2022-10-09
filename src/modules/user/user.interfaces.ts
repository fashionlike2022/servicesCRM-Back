import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from 'src/utils/paginate/paginate';
import { AccessAndRefreshTokens } from 'src/utils/token/token.interfaces';
export interface IUser {
  AN: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  lastSession?: Date;
  verificationToken?: String;
  status?: boolean;
}
export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<
  IUser,
  'role' | 'isEmailVerified' | 'avatar' | 'AN' | 'lastSession' | 'verificationToken' | 'status'
>;

export type NewCreatedUser = Omit<
  IUser,
  'isEmailVerified' | 'lastSession' | 'verificationToken' | 'AN' | 'avatar' | 'status'
>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
