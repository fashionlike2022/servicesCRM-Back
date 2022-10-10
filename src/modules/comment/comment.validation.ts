import Joi from 'joi';
import { objectId } from 'src/middlewares/validate';
import { NewCreatedComment } from './comment.interfaces';

const createCommentBody: Record<keyof NewCreatedComment, any> = {
  content: Joi.string().required(),
  claim: Joi.required().custom(objectId),
};

export const createComment = {
  body: Joi.object().keys(createCommentBody),
};

export const getCommentsByClaim = {
  query: Joi.object().keys({
    sort: Joi.string(),
    perPage: Joi.number().integer(),
    page: Joi.number().integer(),
    user: Joi.custom(objectId),
  }),
};

export const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

export const getCommentsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string(),
    })
    .min(1),
};

export const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};
