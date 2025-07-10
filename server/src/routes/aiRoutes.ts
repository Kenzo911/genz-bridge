import express from 'express';
import { translateGenZ } from '../controllers/aiController';
import { translateGenZSchema } from '../validation/aiValidation';

const router = express.Router();

// Validation middleware
const validateRequest = (schema: any) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ 
        error: error.details[0].message 
      });
      return;
    }
    next();
  };
};

// Routes
router.post('/translate-gen-z', validateRequest(translateGenZSchema), translateGenZ);

export default router; 