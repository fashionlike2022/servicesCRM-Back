import Joi from 'joi';
import { objectId } from '../../middlewares/validate';
import { NewCreatedClaim } from './claim.interfaces';

const createClaimBody: Record<keyof NewCreatedClaim, any> = {
  subject: Joi.string().required(),
  content: Joi.string().required(),
  priority: Joi.string().required().valid('critical', 'high', 'normal', 'low'),
  category: Joi.string().required().valid('services', 'sales', 'billing'),
  // userId: Joi.string().required().custom(objectId),
  // employeeId: Joi.string().required().custom(objectId),
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
    populate: Joi.string(),
    select: Joi.string(),
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

export const updateClaimAssign = {
  params: Joi.object().keys({
    claimId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      employee: Joi.required().custom(objectId),
    })
    .min(1),
};

export const deleteClaim = {
  params: Joi.object().keys({
    claimId: Joi.string().custom(objectId),
  }),
};
