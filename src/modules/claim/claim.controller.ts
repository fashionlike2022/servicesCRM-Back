import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { pick } from 'src/utils';
import { ApiError } from 'src/utils/errors';
import { IOptions } from 'src/utils/paginate/paginate';
import { claimService } from '.';

export const getClaims = async (req: Request, res: Response) => {
  const filter = pick(req.query, ['category', 'status', 'priority']);
  const options: IOptions = pick(req.query, ['sort', 'perPage', 'page']);
  const result = await claimService.queryClaims(filter, options);
  res.send(result);
};

//TODO: getClaimsByEmployee user filters with populate Comments
//TODO: getClaimsByUser with populate Comments

export const getClaim = async (req: Request, res: Response) => {
  if (typeof req.params['claimId'] === 'string') {
    const claim = await claimService.getClaimById(new mongoose.Types.ObjectId(req.params['claimId']));
    if (!claim) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Claim not found');
    }
    res.send(claim);
  }
};

export const createClaim = async (req: Request, res: Response) => {
  const claim = await claimService.createClaim(req.body);
  res.status(httpStatus.CREATED).send(claim);
};

export const updateClaim = async (req: Request, res: Response) => {
  if (typeof req.params['claimId'] === 'string') {
    const claim = await claimService.updateClaimById(new mongoose.Types.ObjectId(req.params['claimId']), req.body);
    res.send(claim);
  }
};

export const deleteClaim = async (req: Request, res: Response) => {
  if (typeof req.params['claimId'] === 'string') {
    await claimService.deleteClaimById(new mongoose.Types.ObjectId(req.params['claimId']));
    res.status(httpStatus.NO_CONTENT);
  }
};
