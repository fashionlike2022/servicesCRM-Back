import Joi from 'joi';
import { objectId } from 'src/middlewares/validate';
import { NewCreatedClaim } from './claim.interfaces';

const createClaimBody: Record<keyof NewCreatedClaim, any> = {
  subject: Joi.string().required(),
  content: Joi.string().required(),
  priority: Joi.string().required(),
  category: Joi.string().required().valid('user', 'admin'),
  userId: Joi.string().required(),
  employeeId: Joi.string().required(),
};

export const createClaim = {
  body: Joi.object().keys(createClaimBody),
};

export const getClaims = {
  query: Joi.object().keys({
    category: Joi.string(),
    priority: Joi.string(),
    status: Joi.string(),
    sort: Joi.string(),
    perPage: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getClaim = {
  params: Joi.object().keys({
    claimId: Joi.string().custom(objectId),
  }),
};

export const updateClaim = {
  params: Joi.object().keys({
    claimId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      subject: Joi.string(),
      content: Joi.string(),
    })
    .min(1),
};

export const deleteClaim = {
  params: Joi.object().keys({
    claimId: Joi.string().custom(objectId),
  }),
};
