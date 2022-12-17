import supertest from "supertest";
import app from "../main";
import useImageProcessing from "../main/services/useImageProcessing";
import { FileNotFoundError } from "../main/helpers/ErrorTypes";
import sharp from "sharp";
import { isPositiveInteger } from "../main/routes/images/ImagesRoute";

describe("testing utils functions", () => {
  it('validate "100" is positive number', () => {
    expect(isPositiveInteger("100")).toBeTrue();
  });

  it('validate "-100" is not a positive number', () => {
    expect(isPositiveInteger("-100")).toBeFalse();
  });

  it('validate "abc" is not a positive number', () => {
    expect(isPositiveInteger("abc")).toBeFalse();
  });
});
describe("testing images api", () => {
  const request = supertest(app);
  const validInputs = [{ filename: "fjord", height: 200, width: 200 }];
  const invalidInputs = [{ filename: "abcd", height: 200, width: 200 }];

  it(`should return file notfound for "${invalidInputs[0].filename}" file`, async () => {
    let error = null;
    try {
      await useImageProcessing(invalidInputs[0].filename).resize(
        invalidInputs[0].width,
        invalidInputs[0].height
      );
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(FileNotFoundError);
  });

  it(`resize image correctly for "${validInputs[0].filename}" file`, async () => {
    const filename = validInputs[0].filename;
    const height = validInputs[0].height;
    const width = validInputs[0].width;
    let error = null;
    let outputFile: String;

    try {
      outputFile = await useImageProcessing(filename).resize(width, height);
    } catch (e) {
      error = e;
    }
    // @ts-ignore
    const imageMetaData = await sharp(outputFile).metadata();
    expect(error).toEqual(null);
    expect(imageMetaData.width).toEqual(width);
    expect(imageMetaData.height).toEqual(height);
  });

  it("request return success status", async () => {
    const filename = validInputs[0].filename;
    const height = validInputs[0].height;
    const width = validInputs[0].width;
    const response = await request.get(
      `/images?filename=${filename}&height=${height}&width=${width}`
    );
    expect(response.statusCode == 200);
  });
});
