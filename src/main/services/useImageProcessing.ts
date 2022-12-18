import sharp from "sharp";
import path from "path";
import * as fs from "fs";
import { FileNotFoundError } from "../helpers/ErrorTypes";

export default (imageName: string) => {
  async function resize(width: number, height: number): Promise<string> {
    const inputFilePath = path.join("./assets/images", `${imageName}.jpg`);
    if (!fs.existsSync(inputFilePath)) {
      throw new FileNotFoundError(`file "${imageName}" not found`);
    }
    const resizedDir = path.join("./assets/resized-images", imageName);
    const outputFilePath = path.join(
      resizedDir,
      `${width}-${height}-${imageName}.jpg`
    );
    if (fs.existsSync(outputFilePath)) {
      return path.resolve(outputFilePath);
    }
    if (!fs.existsSync(resizedDir)) {
      await fs.promises.mkdir(resizedDir, { recursive: true });
    }
    await sharp(inputFilePath).resize(width, height).toFile(outputFilePath);

    return path.resolve(outputFilePath);
  }

  return {
    resize,
  };
};
