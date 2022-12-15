import express from "express";
import useImageProcessing from "../../services/useImageProcessing";
import { FileNotFoundError } from "../../helpers/ErrorTypes";

const route = express.Router();

route.get("/", async (req, res) => {
  if (!validQueryParams(req.query)) {
    res.status(400).send(`wrong params ${JSON.stringify(req.query)}`);
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

function validQueryParams(object: any) {
  return !!(object.filename && object.height && object.width);
}

export default route;
