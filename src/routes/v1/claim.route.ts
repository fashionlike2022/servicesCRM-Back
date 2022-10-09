import express, { Router } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';
import { validate } from 'src/middlewares/validate';
import { claimController, claimValidation } from 'src/modules/claim';
import { asyncHandler } from 'src/utils';

const router: Router = express.Router();

router
  .route('/')
  .get(authMiddleware('getUsers'), validate(claimValidation.getClaims), claimController.getClaims)
  .post(authMiddleware('manageUsers'), validate(claimValidation.createClaim), claimController.createClaim);

router
  .route('/:userId')
  .get(authMiddleware('getUsers'), validate(claimValidation.getClaim), asyncHandler(claimController.getClaim))
  .patch(
    authMiddleware('manageUsers'),
    validate(claimValidation.updateClaim),
    asyncHandler(claimController.updateClaim)
  )
  .delete(
    authMiddleware('manageUsers'),
    validate(claimValidation.deleteClaim),
    asyncHandler(claimController.deleteClaim)
  );

export default router;
