import mongoose from 'mongoose';
import { toJSON } from 'src/utils/toJSON';
import { paginate } from 'src/utils/paginate';
import { ICommentDoc, ICommentModel } from './comment.interfaces';

const commentSchema = new mongoose.Schema<ICommentDoc, ICommentModel>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
    },
    claim: {
      type: 'ObjectId',
      ref: 'Claim',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

const Claim = mongoose.model<ICommentDoc, ICommentModel>('Comment', commentSchema);

export default Claim;
