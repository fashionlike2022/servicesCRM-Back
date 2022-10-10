import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { userService } from '.';
import { ApiError } from 'src/utils/errors';
import { pick } from 'src/utils';
import { IOptions } from 'src/utils/paginate/paginate';

export const getUsers = async (req: Request, res: Response) => {
  const filter = pick(req.query, ['firstName', 'role']);
  const options: IOptions = pick(req.query, ['sort', 'perPage', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
};

export const getUser = async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
};

export const updateUser = async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
    res.send(user);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = typeof req.params['userId'] === 'string' && req.params['userId'];
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment Identifier not found');
  }
  const result = await userService.deleteUserById(new mongoose.Types.ObjectId(userId));
  res.send(result); //.status(httpStatus.NO_CONTENT);
};
