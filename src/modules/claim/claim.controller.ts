import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { pick } from '../../utils';
import { ApiError } from '../../utils/errors';
import { IOptions } from '../../utils/paginate/paginate';
import { claimService } from '.';
import { IUserDoc } from '../user/user.interfaces';

export const getClaims = async (req: Request, res: Response) => {
  const filter = pick(req.query, ['category', 'status', 'priority']);
  const options: IOptions = pick(req.query, ['sort', 'perPage', 'page', 'populate', 'select']);
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
  const user = req.user as IUserDoc;
  const dataClaim = { ...req.body, user: new mongoose.Types.ObjectId(user._id) };
  const claim = await claimService.createClaim(dataClaim);
  res.status(httpStatus.CREATED).send(claim);
};

export const updateClaim = async (req: Request, res: Response) => {
  if (typeof req.params['claimId'] === 'string') {
    const claim = await claimService.updateClaimById(new mongoose.Types.ObjectId(req.params['claimId']), req.body);
    res.send(claim);
  }
};

export const updateClaimAssign = async (req: Request, res: Response) => {
  if (typeof req.params['claimId'] === 'string') {
    // TODO: checking if id req.body.employee user has role "employee"
    const claim = await claimService.updateClaimById(new mongoose.Types.ObjectId(req.params['claimId']), {
      employee: new mongoose.Types.ObjectId(req.body.employee),
    });
    res.send(claim);
  }
};

export const deleteClaim = async (req: Request, res: Response) => {
  const claimId = typeof req.params['claimId'] === 'string' && req.params['claimId'];
  if (!claimId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Claim Identifier not found');
  }
  const result = await claimService.deleteClaimById(new mongoose.Types.ObjectId(req.params['claimId']));
  res.send(result);
  // return res.status(httpStatus.NO_CONTENT);
};
