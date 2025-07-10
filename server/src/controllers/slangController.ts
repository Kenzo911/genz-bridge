import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

export async function getSlangTerms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "25", 10);
    const type = (req.query.type as string) || "all";
    const search = (req.query.search as string) || "";

    const where: any = {};
    if (type && type !== "all") {
      where.type = type;
    }
    if (search) {
      where.term = {
        contains: search,
        mode: "insensitive",
      };
    }

    const prismaAny = prisma as any;

    const total = await prismaAny.slangTerm.count({ where });

    const terms = await prismaAny.slangTerm.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        term: "asc",
      },
    });

    res.json({
      data: terms,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
} 