import express, { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils';
import { claimController, claimValidation } from '../../modules/claim';

const router: Router = express.Router();

router
  .route('/')
  .get(authMiddleware('getUsers'), validate(claimValidation.getClaims), asyncHandler(claimController.getClaims))
  .post(
    authMiddleware('manageUsers'),
    validate(claimValidation.createClaim),
    asyncHandler(claimController.createClaim)
  );

router
  .route('/assign/:claimId')
  .patch(
    authMiddleware('manageUsers'),
    validate(claimValidation.updateClaimAssign),
    asyncHandler(claimController.updateClaimAssign)
  );
router
  .route('/:claimId')
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
