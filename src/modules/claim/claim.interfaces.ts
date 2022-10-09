import { Document, Model, PopulatedDoc } from 'mongoose';
import { QueryResult } from 'src/utils/paginate/paginate';
import { IComment } from '../comments/comment.interfaces';

export interface IClaim {
  subject: string;
  content: string;
  status: string;
  priority: string;
  category: string;
  userId: string;
  employeeId: string;
  completed_at?: Date;
  comments?: PopulatedDoc<IComment & Document>;
}

export type UpdateClaimBody = Partial<IClaim>;

export type NewCreatedClaim = Omit<IClaim, 'completed_at' | 'comments' | 'status'>;

export interface IClaimDoc extends IClaim, Document {}

export interface IClaimModel extends Model<IClaimDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  comments: any;
}
