import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from 'src/utils/errors';
import { IOptions, QueryResult } from 'src/utils/paginate/paginate';
import { Comment } from '../comment';
import { IClaimDoc, NewCreatedClaim, UpdateClaimBody } from './claim.interfaces';
import Claim from './claim.model';

/**
 * Query for claims
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryClaims = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const claims = await Claim.paginate(filter, options);
  return claims;
};

/**
 * Create a claim
 * @param {NewCreatedClaim} claimBody
 * @returns {Promise<IClaimDoc>}
 */
export const createClaim = async (claimBody: NewCreatedClaim): Promise<IClaimDoc> => {
  return Claim.create(claimBody);
};

/**
 * Get claim by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IClaimDoc | null>}
 */
export const getClaimById = async (id: mongoose.Types.ObjectId): Promise<IClaimDoc | null> => {
  const claim = await Claim.findById(id).populate('comments').populate('user').populate('employee').exec();
  return claim;
};

/**
 * Update claim by id
 * @param {mongoose.Types.ObjectId} claimId
 * @param {UpdateClaimBody} updateBody
 * @returns {Promise<IClaimDoc | null>}
 */
export const updateClaimById = async (
  claimId: mongoose.Types.ObjectId,
  updateBody: UpdateClaimBody
): Promise<IClaimDoc | null> => {
  const claim = await getClaimById(claimId);
  if (!claim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Claim not found');
  }
  Object.assign(claim, updateBody);
  await claim.save();
  return claim;
};

export const updateClaimCommentsById = async (claimId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId) => {
  const claim = await Claim.updateOne({ _id: claimId }, { $push: { comments: commentId } });
  return claim;
};
export const deleteClaimCommentsById = async (claimId: mongoose.Types.ObjectId, commentId: mongoose.Types.ObjectId) => {
  const claim = await Claim.updateOne({ _id: claimId }, { $pull: { comments: commentId } });
  return claim;
};

/**
 * Delete claim by id
 * @param {mongoose.Types.ObjectId} claimId
 * @returns {Promise<IClaimDoc | null>}
 */
export const deleteClaimById = async (claimId: mongoose.Types.ObjectId): Promise<IClaimDoc | null> => {
  const claim = await getClaimById(claimId);
  if (!claim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Claim not found');
  }
  // delete all comments related
  await Comment.deleteMany({ claim: claimId });
  const result = await claim.remove();
  return result;
};
