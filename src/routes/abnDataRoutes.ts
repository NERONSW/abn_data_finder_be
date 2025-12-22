import express from "express";
import { getAllABNs } from "../controllers/abnDataController";

const router = express.Router();

router.get("/", getAllABNs);

export default router;
