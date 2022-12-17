import express from "express";
import useImageProcessing from "../../services/useImageProcessing";
import { FileNotFoundError } from "../../helpers/ErrorTypes";

const route = express.Router();

route.get("/", async (req, res) => {
  if (
    !("filename" in req.query) ||
    !("width" in req.query) ||
    !("height" in req.query)
  ) {
    res
      .status(400)
      .send(`missing query parameters ${JSON.stringify(req.query)}`);
    return;
  }
  if (
    !isPositiveInteger(req.query.height as string) ||
    !isPositiveInteger(req.query.width as string)
  ) {
    res.status(400).send("please enter valid width and height");
    return;
  }
  const fileName = req.query.filename as string;
  const height = parseInt(req.query.height as string);
  const width = parseInt(req.query.width as string);
  try {
    const resizedFile = await useImageProcessing(fileName).resize(
      width,
      height
    );
    res.status(200).sendFile(resizedFile);
    return;
  } catch (e) {
    if (e instanceof FileNotFoundError) {
      res.status(404).send(e.message);
    } else {
      console.error(e);
      res.status(500).send(e);
    }
  }
});

export function isPositiveInteger(value: string): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

export default route;
