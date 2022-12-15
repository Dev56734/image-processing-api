import express from "express";
import { default as imagesRoutes } from "./images/ImagesRoute";

const router = express.Router();

router.use("/images", imagesRoutes);

export default router;
