import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export async function createReport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, tags = [], message } = req.body as {
      title?: string;
      tags?: string[];
      message: string;
    };

    const prismaAny = prisma as any;

    await prismaAny.report.create({
      data: {
        title: title && title.trim() !== '' ? title.trim() : null,
        tags,
        message,
      },
    });

    res.status(201).json({ message: 'Feedback received successfully!' });
  } catch (error) {
    next(error);
  }
} 