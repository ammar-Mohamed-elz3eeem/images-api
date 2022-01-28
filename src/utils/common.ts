import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { thumbnailsPath } from '../middleware/imagesMiddleware';

export const sharpResize = async (filename: string, width: string, height: string) => {
  return await sharp(filename).resize(parseInt(width), parseInt(height));
};

export const convertToBuffer = async (thumbImg: string): Promise<Buffer> => {
  return await sharp(thumbImg).toBuffer();
};
