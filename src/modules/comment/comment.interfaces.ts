import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from 'src/utils/paginate/paginate';

export interface IComment {
  content: string;
  user: mongoose.Types.ObjectId;
  claim: mongoose.Types.ObjectId;
}

export type UpdateCommentBody = Partial<IComment>;

export type NewCreatedComment = Omit<IComment, 'user'>;

export interface ICommentDoc extends IComment, Document {}

export interface ICommentModel extends Model<ICommentDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
