import mongoose from 'mongoose';
import { toJSON } from 'src/utils/toJSON';
import { paginate } from 'src/utils/paginate';
import { IClaimDoc, IClaimModel } from './claim.interfaces';

const claimSchema = new mongoose.Schema<IClaimDoc, IClaimModel>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String, // enum
      enum: ['completed', 'pending'],
      required: true,
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'normal', 'low'],
      required: true,
    },
    category: {
      type: String,
      enum: ['services', 'sales', 'billing'],
      required: true,
    },
    // comments: { type: 'ObjectId', ref: 'Comment' },
    comments: [
      {
        comment: {
          type: 'ObjectId',
          ref: 'Comment',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
claimSchema.plugin(toJSON);
claimSchema.plugin(paginate);

const Claim = mongoose.model<IClaimDoc, IClaimModel>('Claim', claimSchema);

export default Claim;
