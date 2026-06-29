import { Request, Response, NextFunction } from 'express';

const hasInjection = (obj: any): any => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        hasInjection(obj[key]);
      }
    }
  }
  return obj;
};

export const mongoSanitize = (req: Request, res: Response, next: NextFunction): void => {
  req.body = hasInjection(req.body);
  req.query = hasInjection(req.query);
  req.params = hasInjection(req.params);
  next();
};

export default mongoSanitize;
