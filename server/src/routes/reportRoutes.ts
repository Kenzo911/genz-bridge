import express from 'express';
import { createReport } from '../controllers/reportController';
import { reportSchema } from '../validation/reportValidation';

const router = express.Router();

// Generic validation middleware reused across routes
const validateRequest = (schema: any) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    next();
  };
};

// POST /api/report-feedback
router.post('/report-feedback', validateRequest(reportSchema), createReport);

export default router; 