import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from 'src/utils/errors';
import { IOptions, QueryResult } from 'src/utils/paginate/paginate';
import { claimService } from '../claim';
import { ICommentDoc, NewCreatedComment, UpdateCommentBody } from './comment.interfaces';
import Comment from './comment.model';

/**
 * Query for comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryComments = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const comments = await Comment.paginate(filter, { ...options, populate: 'user,claim' });
  return comments;
};

/**
 * Create a claim
 * @param {NewCreatedComment} commentBody
 * @returns {Promise<ICommentDoc>}
 */
export const createComment = async (commentBody: NewCreatedComment): Promise<ICommentDoc> => {
  // if (await Claim.isEmailTaken(commentBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return Comment.create(commentBody);
};

/**
 * Get comment by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICommentDoc | null>}
 */
export const getCommentById = async (id: mongoose.Types.ObjectId): Promise<ICommentDoc | null> =>
  Comment.findById(id).populate('user').populate('claim');

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
// export const getUserByEmail = async (email: string): Promise<IClaimDoc | null> => User.findOne({ email });

/**
 * Update comment by id
 * @param {mongoose.Types.ObjectId} commentId
 * @param {UpdateCommentBody} updateBody
 * @returns {Promise<ICommentDoc | null>}
 */
export const updateCommentById = async (
  commentId: mongoose.Types.ObjectId,
  updateBody: UpdateCommentBody
): Promise<ICommentDoc | null> => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coment not found');
  }
  // if (updateBody.email && (await Claim.isEmailTaken(updateBody.email, userId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

/**
 * Delete comment by id
 * @param {mongoose.Types.ObjectId} commentId
 * @returns {Promise<ICommentDoc | null>}
 */
export const deleteCommentById = async (commentId: mongoose.Types.ObjectId): Promise<ICommentDoc | null> => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  // remove reference in Claim Doc
  await claimService.deleteClaimCommentsById(new mongoose.Types.ObjectId(comment.claim._id), commentId);
  const result = await comment.remove();
  return result;
};
