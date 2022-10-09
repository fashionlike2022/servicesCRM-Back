import express, { Router } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';
import { validate } from 'src/middlewares/validate';
import { asyncHandler } from 'src/utils';
import { userController, userValidation } from '../../modules/user';

const router: Router = express.Router();

router
  .route('/')
  .post(authMiddleware('manageUsers'), validate(userValidation.createUser), asyncHandler(userController.createUser))
  .get(authMiddleware('getUsers'), validate(userValidation.getUsers), asyncHandler(userController.getUsers));

router
  .route('/:userId')
  .get(authMiddleware('getUsers'), validate(userValidation.getUser), asyncHandler(userController.getUser))
  .patch(authMiddleware('manageUsers'), validate(userValidation.updateUser), asyncHandler(userController.updateUser))
  .delete(authMiddleware('manageUsers'), validate(userValidation.deleteUser), asyncHandler(userController.deleteUser));

export default router;
