import { Response } from 'express';

interface ApiResponseParams {
  res: Response;
  statusCode?: number;
  message: string;
  data?: any;
  meta?: any;
}

export const sendResponse = ({
  res,
  statusCode = 200,
  message,
  data = null,
  meta = null,
}: ApiResponseParams): void => {
  const requestId = res.getHeader('x-request-id') || undefined;

  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    meta,
    requestId,
    timestamp: new Date().toISOString(),
  });
};
