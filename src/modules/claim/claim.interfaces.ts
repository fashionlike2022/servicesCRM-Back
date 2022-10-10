import mongoose, { Document, Model, PopulatedDoc } from 'mongoose';
import { QueryResult } from '../../utils/paginate/paginate';
import { IComment, ICommentDoc } from '../comment/comment.interfaces';
import { IUser } from '../user/user.interfaces';

export interface IClaim {
  subject: string;
  content: string;
  status: string;
  priority: string;
  category: string;
  user?: PopulatedDoc<IUser & Document>;
  employee?: PopulatedDoc<IUser & Document>;
  completed_at?: Date;
  // comments?: PopulatedDoc<IComment & Document>[];
  comments: ICommentDoc[] | string[];
  // comments?: [{ type: mongoose.Schema.Types.ObjectId; ref: 'Comment' }];
}

export type UpdateClaimBody = Partial<IClaim>;

export type NewCreatedClaim = Omit<IClaim, 'completed_at' | 'comments' | 'status' | 'employee' | 'user'>;

export interface IClaimDoc extends IClaim, Document {}

export interface IClaimModel extends Model<IClaimDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  comments: ICommentDoc[] | string[];
}
