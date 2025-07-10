import express from "express";
import { getSlangTerms } from "../controllers/slangController";

const router = express.Router();

router.get("/", getSlangTerms);

export default router; 