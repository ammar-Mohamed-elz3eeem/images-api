import { Express, Request, Response, NextFunction } from 'express';

export const handleErrs = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).end('Something went wrong, Please try again');
};
