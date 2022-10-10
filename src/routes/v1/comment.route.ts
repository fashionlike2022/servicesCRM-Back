import express, { Router } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';
import { validate } from 'src/middlewares/validate';
import { commentController, commentValidation } from 'src/modules/comment';
import { asyncHandler } from 'src/utils';

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
