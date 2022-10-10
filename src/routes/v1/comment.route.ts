import express, { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils';
import { commentController, commentValidation } from '../../modules/comment';

const router: Router = express.Router();

router
  .route('/')
  .get(
    authMiddleware('getUsers'),
    validate(commentValidation.getCommentsByClaim),
    asyncHandler(commentController.getCommentsByClaim)
  )
  .post(
    authMiddleware('manageUsers'),
    validate(commentValidation.createComment),
    asyncHandler(commentController.createComment)
  );

router
  .route('/:commentId')
  .get(authMiddleware('getUsers'), validate(commentValidation.getComment), asyncHandler(commentController.getComment))
  .patch(
    authMiddleware('manageUsers'),
    validate(commentValidation.updateComment),
    asyncHandler(commentController.updateComment)
  )
  .delete(
    authMiddleware('manageUsers'),
    validate(commentValidation.deleteComment),
    asyncHandler(commentController.deleteComment)
  );

export default router;
