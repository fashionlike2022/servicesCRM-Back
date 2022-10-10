import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { pick } from '../../utils';
import { ApiError } from '../../utils/errors';
import { IOptions } from '../../utils/paginate/paginate';
import { commentService } from '.';
import { claimService } from '../claim';
import { IUserDoc } from '../user/user.interfaces';

export const getCommentsByClaim = async (req: Request, res: Response) => {
  const filter = pick(req.query, ['user']);
  const options: IOptions = pick(req.query, ['sort', 'perPage', 'page']);
  const result = await commentService.queryComments(filter, options);
  res.send(result);
};

export const getComment = async (req: Request, res: Response) => {
  if (typeof req.params['commentId'] === 'string') {
    const comment = await commentService.getCommentById(new mongoose.Types.ObjectId(req.params['commentId']));
    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }
    res.send(comment);
  }
};

export const createComment = async (req: Request, res: Response) => {
  const user = req.user as IUserDoc;
  const dataComment = {
    ...req.body,
    user: new mongoose.Types.ObjectId(user._id),
    claim: new mongoose.Types.ObjectId(req.body.claim),
  };
  const comment = await commentService.createComment(dataComment);
  await claimService.updateClaimCommentsById(
    new mongoose.Types.ObjectId(req.body.claim),
    new mongoose.Types.ObjectId(comment._id)
  );
  res.status(httpStatus.CREATED).send(comment);
};

export const updateComment = async (req: Request, res: Response) => {
  if (typeof req.params['commentId'] === 'string') {
    const comment = await commentService.updateCommentById(
      new mongoose.Types.ObjectId(req.params['commentId']),
      req.body
    );
    res.send(comment);
  }
};

// If send request by example checkbox many comments
// TODO: Make delete by array o list of objectId comments (ex: DELETE ../comments/12dad1342234234,1341231243121213,4131..)

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = typeof req.params['commentId'] === 'string' && req.params['commentId'];
  if (!commentId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment Identifier not found');
  }
  const result = await commentService.deleteCommentById(new mongoose.Types.ObjectId(commentId));
  res.send(result); //.status(httpStatus.NO_CONTENT);
};
