import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { thumbnailsPath } from '../middleware/imagesMiddleware';

export const sharpResize = async (
  filename: string,
  width: string,
  height: string
): Promise<Buffer | Error> => {
  try {
    return await sharp(filename)
      .resize(parseInt(width), parseInt(height))
      .toBuffer();
  } catch (error) {
    throw new Error('Invalid File name or Dimensions');
  }
};

export const saveImageToThumbs = async (
  filename: string,
  width: string,
  height: string,
  thumbImage: string
): Promise<void> => {
  await sharp(filename)
    .resize(parseInt(width), parseInt(height))
    .toFile(thumbImage);
};

export const convertToBuffer = async (thumbImg: string): Promise<Buffer> => {
  return await sharp(thumbImg).toBuffer();
};
